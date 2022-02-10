export type TreeData<T> = {
    data: T;
    children?: TreeData<T>[];
};


export class Tree<T> {
    private data: TreeData<T>;
    private mountElement: HTMLElement;
    private renderFunction: (elem: HTMLElement, data: T, cb: () => void) => void;
    private dragging: boolean;
    private dragEvent: MouseEvent;

    private viewPort = {
        scale: 1,
        xOffset: 0,
        yOffset: 0,
    }

    constructor(mountElement: HTMLElement, data: TreeData<T>) {
        this.mountElement = mountElement;
        this.mountElement.innerHTML = ""; // wipe it wipe

        this.mountElement.attributes.setNamedItem(document.createAttribute("tree-mount"));
        this.mountElement.style.display = "flex";
        this.mountElement.style.justifyContent = "center";
        this.mountElement.style.width = "fit-content";
        this.mountElement.style.position = "relative";


        const debug = document.createElement('div');
        debug.style.position = "absolute";
        debug.style.top = "0"
        debug.style.border = "1px solid black"
        debug.style.margin = "8px"
        debug.style.padding = "8px"
        debug.innerHTML =" hello"
        this.mountElement.parentNode.appendChild(debug);

        const treeRoot = document.createElement("div");
        treeRoot.attributes.setNamedItem(document.createAttribute("tree-root"));
        this.mountElement.appendChild(treeRoot);
        treeRoot.style.width = "fit-content";

        this.data = data;
        this.setRenderFunction(DEFAULT_RENDER_FUNCTION);
        this.dragging = false;
        this.mountElement.style.cursor = "grab"


        // zoom listener
        mountElement.addEventListener('wheel', (ev) => {           

            const { clientX, clientY, screenX, screenY, movementX, movementY, offsetX, offsetY, pageX, pageY } = ev;
            debug.innerHTML = JSON.stringify({ clientX, clientY, screenX, screenY, movementX, movementY, offsetX, offsetY, pageX, pageY }, null , 4)
            // Calculate the new zoom level
            const screenWidth = Math.abs(ev.clientX) + Math.abs(ev.screenX); // TODO make relative to the mountElement
            const screenHeight = Math.abs(ev.clientY) + Math.abs(ev.screenY); // TODO make relative to the mountElement
            const previousScale = this.viewPort.scale;
            const zoomFactor = 1000; // Determines how 'fast' the zooming occurs when scrolling
            this.viewPort.scale -= ev.deltaY/zoomFactor * previousScale;

            // Calculate the x and y offsets necessary to zoom in at the cursor 
            // position
            const scaleIncrementRatio = this.viewPort.scale / previousScale;
            const mapWidth = mountElement.getBoundingClientRect().width;
            const mapHeight = mountElement.getBoundingClientRect().height;
            const mapWidthDelta = (mapWidth * scaleIncrementRatio) - mapWidth;
            const mapHeightDelta = (mapHeight*scaleIncrementRatio) - mapHeight;
            // calculate what ratio of the dimension increments should be used 
            // to alter the offsets
            const incrementRatioOfOffsetX = 1 - (ev.clientX / (screenWidth / 2));
            const incrementRatioOfOffsetY = (ev.clientY / (screenHeight / 2));
            
            this.viewPort.xOffset += incrementRatioOfOffsetX*mapWidthDelta;
            this.viewPort.yOffset += incrementRatioOfOffsetY*mapHeightDelta;
            
            treeRoot.style.transform = `matrix(${this.viewPort.scale}, 0, 0, ${this.viewPort.scale}, ${this.viewPort.xOffset}, ${this.viewPort.yOffset})`
        })

        mountElement.addEventListener('mousedown', (ev) => {
            this.dragging = true;
            this.mountElement.style.cursor = "grabbing"
            this.dragEvent = ev;
        })

        mountElement.addEventListener('mouseup', (ev) => {
            this.dragging = false;
            this.mountElement.style.cursor = "grab"
        })
        mountElement.addEventListener('mouseleave', (ev) => {
            this.dragging = false;
            this.mountElement.style.cursor = "grab"
        })
        mountElement.addEventListener('mousemove', (ev) => {
            if (!this.dragging) {
                return;
            }

            const { clientX, clientY } = this.dragEvent;
            this.dragEvent = ev;
            
            this.viewPort.xOffset -= clientX - ev.clientX;
            this.viewPort.yOffset -= clientY - ev.clientY;
            treeRoot.style.transform = `matrix(${this.viewPort.scale}, 0, 0, ${this.viewPort.scale}, ${this.viewPort.xOffset}, ${this.viewPort.yOffset})`
        })
    }

    public setRenderFunction(customRenderFunction: (nodeElement: HTMLElement, nodeData: T, cb: () => void) => void) {
        this.renderFunction = customRenderFunction;
    }

    public render() {
        const treeRoot = this.mountElement.querySelector('div');
        this.renderSubTree(treeRoot, this.data)
    }

    private renderSubTree(parentElem: HTMLElement, subtreeData: TreeData<T>) {
        const subTreeElem = document.createElement('div');
        subTreeElem.attributes.setNamedItem(document.createAttribute("tree-node"));
        subTreeElem.style.display = 'flex';
        subTreeElem.style.flexDirection = 'column';
        subTreeElem.style.alignItems = 'center';
        subTreeElem.style.width = 'fit-content';

        this.renderFunction(subTreeElem, subtreeData.data, () => {
            parentElem.appendChild(subTreeElem);
            
            if (subtreeData.children){
                const childrenElem = document.createElement('div');
                childrenElem.style.display = "flex"; 
                subTreeElem.appendChild(childrenElem);

                for (let childData of subtreeData.children) {
                    this.renderSubTree(childrenElem, childData)
                }
                
            }
        });
    }
}


export function DEFAULT_RENDER_FUNCTION(nodeElement: HTMLElement, nodeData: any, cb: () => void) {
    const renderElem = document.createElement('div');
    renderElem.style.padding = "8px";
    renderElem.style.margin = "24px";
    renderElem.style.border = "1px solid black";

    const contentElem = document.createElement('dl');
    Object.entries(nodeData).forEach(([key, value]: [string, string]) => {
        const term = document.createElement('dt');
        term.innerHTML = key;
        const description = document.createElement('dd');
        description.innerHTML = value;

        contentElem.appendChild(term);
        contentElem.appendChild(description);
        renderElem.appendChild(contentElem);
    })
    
    nodeElement.appendChild(renderElem);
    cb();
}

function assert(x, y, msg) {
    if (x !== y){
        console.log("ASSERTION FAILURE:", msg)
        console.log({x, y})
    }
}