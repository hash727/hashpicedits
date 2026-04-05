export const getInitialCanvasJson = (width: number, height: number) => ({
  version: "5.3.0",
  objects: [],
  background: "#ffffff",
  clipPath: {
    type: "rect",
    left: 0,
    top: 0,
    width,
    height,
    fill: "#ffffff",
  },
});
