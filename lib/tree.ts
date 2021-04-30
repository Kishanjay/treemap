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

    constructor(mountElement: HTMLElement, data: TreeData<T>) {
        this.mountElement = mountElement;
        this.data = data;
        this.setRenderFunction(DEFAULT_RENDER_FUNCTION);
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