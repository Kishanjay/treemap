export type TreeData<T> = {
    data: T;
    children?: TreeData<T>[];
};

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

export class Tree<T> {
    private data: TreeData<T>;
    private mountElement: HTMLElement;
    private renderFunction: (elem: HTMLElement, data: T, cb: () => void) => void;

    private viewPort = {
        scale: 1,
        xOffset: 0,
        yOffset: 0,
    }

    constructor(mountElement: HTMLElement, data: TreeData<T>) {
        this.mountElement = mountElement;
        mountElement.style.width = "fit-content";
        this.data = data;
        this.setRenderFunction(DEFAULT_RENDER_FUNCTION);

        mountElement.addEventListener('wheel', (ev) => {   
            // console.log(ev);
            const {clientX: screenX, screenX: screenXRemainder} = ev;
        
            const screenWidth = Math.abs(screenX) + Math.abs(screenXRemainder);    
            const previousScale = this.viewPort.scale;
            const zoomFactor = 1000; // Determines how 'fast' the zooming occurs when scrolling
            this.viewPort.scale -= ev.deltaY/zoomFactor * previousScale;
            const scaleIncrementRatio = this.viewPort.scale / previousScale; // increase in scale
            const mapWidth = mountElement.getBoundingClientRect().width;
            const mapHeight = mountElement.getBoundingClientRect().height;
            

            // zoom pan method based on keeping the 'map' and 'newMap' xPos
            // ratio consistent. e.g. showing the pixel at 0.3 of the map at
            // screenX 10, should remain the same. Thus we calculate a ratioOffsetFix
            // to correct this. Doesn't work as smooth as expected.
            // IMPLEMENTATION:
            // const xRatio = screenX / screenWidth;
            // console.log("Visible on the screen now:");
            // console.log(`x[0 - ${screenWidth}] @ ${screenX} (${xRatio})`);

            // const xOffset = this.viewPort.xOffset;
            // const invisibleMapWidth = mapWidth - screenWidth;
            // const mapTouchPointRatio = (invisibleMapWidth/2 + screenX + xOffset) / mapWidth;
            // console.log(`x[${invisibleMapWidth/2} - ${mapWidth - invisibleMapWidth/2}] @ ${invisibleMapWidth/2 + screenX} (${mapTouchPointRatio}) = map projection now`)

            // const newMapWidth = mapWidth * scaleIncrementRatio;
            // const newInvisibleMapWidth = newMapWidth - screenWidth;
            // const newMapTouchPointRatio = (newInvisibleMapWidth/2 + screenX + xOffset) / newMapWidth
            // console.log(`x[${newInvisibleMapWidth/2} - ${newMapWidth - newInvisibleMapWidth/2}] @ ${newInvisibleMapWidth/2 + screenX} (${newMapTouchPointRatio}) = map projection after scale up`)

            // const ratioOffsetFix = (mapTouchPointRatio * newMapWidth) - newInvisibleMapWidth/2 - screenX - xOffset;
            // this.viewPort.xOffset -= ratioOffsetFix

            // better method which calculates the increase in dimensions and
            // computes which part of this increment should be dedicated towards
            // offsetting the start coordinates. The intuition is that we 
            // use 100% of the increment when the furthest of from the center
            const mapWidthDelta = (mapWidth * scaleIncrementRatio) - mapWidth;
            const mapHeightDelta = (mapHeight*scaleIncrementRatio) - mapHeight;
            const incrementRatioOfOffset = 1 - (screenX / (screenWidth / 2));

            this.viewPort.xOffset += incrementRatioOfOffset*mapWidthDelta;
            this.viewPort.yOffset += incrementRatioOfOffset*mapHeightDelta;
            
            mountElement.style.transform = `matrix(${this.viewPort.scale}, 0, 0, ${this.viewPort.scale}, ${this.viewPort.xOffset}, ${this.viewPort.yOffset})`
        })
    }

    public setRenderFunction(customRenderFunction: (nodeElement: HTMLElement, nodeData: T, cb: () => void) => void) {
        this.renderFunction = customRenderFunction;
    }

    public render() {
        this.renderSubTree(this.mountElement, this.data)
    }

    private renderSubTree(parentElem: HTMLElement, subtreeData: TreeData<T>) {
        const subTreeElem = document.createElement('div');
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


function assert(x, y, msg) {
    if (x !== y){
        console.log("ASSERTION FAILURE:", msg)
        console.log({x, y})
    }
}