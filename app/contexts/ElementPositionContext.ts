import { createContext } from "react";
import type { LayoutFormattedData } from "~/routes/_index";
const ElementPositionContext = createContext<LayoutFormattedData | null>(null);
export const ElementPositionContextProvider = ElementPositionContext.Provider;
export default ElementPositionContext;
