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
    RESIZABLE_TYPE_IMAGE = "image"
}
type ResizableContentElement = (HTMLDivElement | HTMLImageElement);
interface ResizableConfig {
    contentEl: ResizableContentElement;
    type: ResizableType;
    // TODO: Melhorar como pegar essa parte. usar: wrapperBounds
    wrapperLeft: number;
}
declare abstract class Resizable {
    protected readonly resizableElement: HTMLDivElement | HTMLImageElement;
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
    getElement(): HTMLDivElement | HTMLImageElement;
}
type WrapperContentElement = (HTMLDivElement | HTMLImageElement);
declare abstract class ElementManipulable {
    protected readonly contentEl: WrapperContentElement;
    protected readonly wrapperElement: HTMLElement;
    private readonly type;
    private wrapperBounds;
    protected contentWrapper: HTMLDivElement;
    private id;
    onStartResize: () => void;
    onStopResize: () => void;
    onElementSelect: (_id: string) => void;
    protected resizableElement: Resizable | null;
    constructor(contentEl: WrapperContentElement, wrapperElement: HTMLElement, isResizable: boolean, isDragabble: boolean, type: ResizableType);
    protected abstract setCenterPosition(): void;
    private configureElements;
    private initEvents;
    private handleSelectedElement;
    removeSelection(): void;
    getElement(): WrapperContentElement;
    getId(): string;
    getType(): ResizableType;
}
interface WrapperConfig {
    el: HTMLElement;
}
interface WrapperContentElementConfig {
    contentEl: WrapperContentElement;
    isResizable?: boolean;
    isDragabble?: boolean;
}
declare class Wrapper {
    private readonly wrapperElement;
    private isResizing;
    private elements;
    onElementSelect: (_element: ElementManipulable) => void;
    onNoneElementSelect: () => void;
    constructor({ el }: WrapperConfig);
    addElement(wrapperContentElemConfig: WrapperContentElementConfig): void;
    private makeElement;
    private addElementManipulate;
    private initEvents;
    private handleClick;
}
export { Wrapper };
