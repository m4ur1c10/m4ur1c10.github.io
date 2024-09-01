declare enum ResizePointTypeEnum {
    TOP_LEFT = "tl",
    TOP_RIGHT = "tr",
    BOTTOM_LEFT = "bl",
    BOTTOM_RIGHT = "br",
    MIDDLE_RIGHT = "mr",
    MIDDLE_LEFT = "ml",
    MIDDLE_TOP = "mt",
    MIDDLE_BOTTOM = "mb"
}
declare enum ResizableType {
    RESIZABLE_TYPE_TEXT = "text",
    RESIZABLE_TYPE_IMAGE = "image",
    RESIZABLE_TYPE_VIDEO = "video",
    RESIZABLE_TYPE_SVG = "svg"
}
type ResizableContentElement = (HTMLDivElement | HTMLImageElement | HTMLVideoElement | SVGElement);
interface ResizableConfig {
    contentEl: ResizableContentElement;
    type: ResizableType;
    // TODO: Melhorar como pegar essa parte. usar: wrapperBounds
    wrapperLeft: number;
}
declare abstract class Resizable {
    protected readonly resizableElement: HTMLDivElement | HTMLImageElement | HTMLVideoElement | SVGElement;
    protected wrapperLeft: number;
    private shadowElement;
    private readonly type;
    onStartResize: () => void;
    onStopResize: () => void;
    constructor({ contentEl, type, wrapperLeft }: ResizableConfig);
    private initEvents;
    private handleClick;
    abstract doResize(clientX: number, clientY: number, resizeDirection: ResizePointTypeEnum): void;
    removeSelection(): void;
    getElement(): HTMLDivElement | HTMLImageElement | HTMLVideoElement | SVGElement;
}
declare class TopToolBoxElement {
    protected readonly contentElement: HTMLElement;
    protected readonly topToolBoxElement: HTMLDivElement;
    private readonly linkButton;
    private readonly removeLinkButton;
    private readonly removeButton;
    onLinkSubmit: (_link: string) => void;
    onLinkRemove: () => void;
    onClickRemoveButton: () => void;
    constructor(contentElement: HTMLElement);
    setEnableAddLink(enable?: boolean): void;
    show(): void;
    hide(): void;
}
type WrapperContentElement = (HTMLDivElement | HTMLImageElement | HTMLVideoElement | HTMLOrSVGImageElement);
declare abstract class ElementManipulable {
    protected readonly contentEl: WrapperContentElement;
    protected readonly wrapperElement: HTMLElement;
    private readonly isResizable;
    private readonly isDragabble;
    protected countElement: number;
    private readonly type;
    private wrapperBounds;
    protected contentWrapper: HTMLDivElement;
    private id;
    onStartResize: () => void;
    onStopResize: () => void;
    onElementSelect: (_id: string) => void;
    onRightClick: (_e: MouseEvent) => void;
    onDeleted: () => void;
    protected resizableElement: Resizable | null;
    protected topToolBoxElement: TopToolBoxElement;
    constructor(contentEl: WrapperContentElement, wrapperElement: HTMLElement, isResizable: boolean, isDragabble: boolean, countElement: number, type: ResizableType);
    protected abstract setCenterPosition(): void;
    private configureElements;
    private initEvents;
    private handleSelectedElement;
    private handleContextMenu;
    protected removeLinkWrapperElement(): void;
    protected createLinkWrapperElement(link: string): void;
    protected abstract hasAnySelectionInText(): boolean;
    deleteElement(): void;
    removeSelection(): void;
    getElement(): WrapperContentElement;
    abstract getElementClear(): WrapperContentElement;
    getId(): string;
    getType(): ResizableType;
    /**
     * Used for z-index layer position
     */
    getCountPosition(): number;
    /**
     * Used for z-index layer position
     */
    setCountPosition(count: number): void;
    isElementDragabble(): boolean;
    isElementResizable(): boolean;
}
interface WrapperConfig {
    el: HTMLElement;
}
interface WrapperContentElementConfig {
    contentEl: WrapperContentElement;
    isResizable?: boolean;
    isDragabble?: boolean;
}
type ElementPosition = {
    position: number;
    id: string;
};
type ElementPositionWithElement = ElementPosition & {
    element: ElementManipulable;
};
declare enum WrapperTypeEventEnum {
    ELEMENTS_ORDER_CHANGE = "elements:order:change",
    ELEMENT_ON_DELETED = "element:on:deleted"
}
declare class Wrapper {
    private readonly wrapperElement;
    private isResizing;
    private elements;
    private countElement;
    private contextMenu;
    private onEvents;
    onElementSelect: (_element: ElementManipulable) => void;
    onNoneElementSelect: () => void;
    constructor({ el }: WrapperConfig);
    addElement(wrapperContentElemConfig: WrapperContentElementConfig): void;
    private makeElement;
    private addElementManipulate;
    private initEvents;
    private handleClick;
    private sendElementTopOrBottom;
    private getNextPosition;
    private disableContextMenuItemsByElement;
    private getElementsPositionsOrdered;
    getElementsLayer(): ElementPositionWithElement[];
    setPositionElement(elementId: string, newPosition: number): void;
    on(typeEvent: WrapperTypeEventEnum, callback: (...args: any[]) => void): void;
    private send;
}
export { Wrapper };
