
export interface LayoutElement {
  id: string;
  top: string;
  left: string;
  width: string;
  height: string;
  // Typography
  textContent: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  textAlign: string;
  textShadow: string;
  // Styling
  background: string;
  borderRadius: string;
  border: string;
  boxShadow: string;
  zIndex: number;
  transform: string;
  opacity: number;
  filter: string;
  clipPath: string;
  mixBlendMode: string;
}

export interface LayoutContainer {
  width: string;
  height: string;
  backgroundColor: string;
}

export interface LayoutData {
  container: LayoutContainer;
  elements: LayoutElement[];
}
