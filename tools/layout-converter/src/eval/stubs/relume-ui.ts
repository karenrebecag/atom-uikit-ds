// Stub de las primitivas: no ejecuta el paquete real. Cada primitiva produce IR con su identidad
// (component.name) para que el emisor pueda mapearla a un nativo de Webflow.
import { Fragment, jsx } from "../jsx-runtime";
import type { IREl, IRNode } from "../ir";
import { reportGeneric } from "../report";

type Props = Record<string, unknown>;

function primitive(name: string, tag: string, fixed: Props = {}) {
  const C = (props: Props) => {
    const { children, className, asChild, ...rest } = props;
    // asChild (Radix Slot): la primitiva no pinta su propio elemento, se fusiona con el hijo unico
    if (asChild && children && typeof children === "object" && !Array.isArray(children) && (children as IREl).kind === "el") {
      const child = children as IREl;
      const extra = typeof className === "string" ? className.split(/\s+/).filter(Boolean) : [];
      return { ...child, classes: [...child.classes, ...extra], component: { name, props: rest } };
    }
    const el = jsx(tag, { ...fixed, ...rest, className, children }) as IREl;
    return { ...el, component: { name, props: rest } };
  };
  Object.defineProperty(C, "name", { value: name });
  return C;
}

// Raices de estado (Radix): no tienen DOM propio, solo pasan sus hijos.
function passthrough(name: string) {
  const C = (props: Props) => jsx(Fragment, { children: props.children });
  Object.defineProperty(C, "name", { value: name });
  return C;
}

// Tag por primitiva: el elemento que la primitiva real pinta en el DOM.
const TAGS: Record<string, string> = {
  Button: "button", Input: "input", Textarea: "textarea", Label: "label", Checkbox: "button",
  Switch: "button", Badge: "div", Calendar: "div", Slider: "div", VideoIframe: "iframe",
  Accordion: "div", AccordionItem: "div", AccordionTrigger: "button", AccordionContent: "div",
  Tabs: "div", TabsList: "div", TabsTrigger: "button", TabsContent: "div",
  DialogTrigger: "button", DialogContent: "div",
  SelectTrigger: "button", SelectContent: "div", SelectItem: "div", SelectValue: "span",
  RadioGroup: "div", RadioGroupItem: "button",
  DropdownMenuTrigger: "button", DropdownMenuContent: "div", DropdownMenuGroup: "div",
  DropdownMenuItem: "div", DropdownMenuLabel: "div", DropdownMenuSeparator: "div",
  Breadcrumb: "nav", BreadcrumbList: "ol", BreadcrumbItem: "li", BreadcrumbLink: "a", BreadcrumbSeparator: "li",
  Pagination: "nav", PaginationContent: "ul", PaginationItem: "li", PaginationLink: "a",
  PaginationNext: "a", PaginationPrevious: "a",
  Carousel: "div", CarouselContent: "div", CarouselItem: "div", CarouselNext: "button", CarouselPrevious: "button",
  PopoverTrigger: "button", PopoverContent: "div",
  SheetTrigger: "button", SheetContent: "div", SheetHeader: "div", SheetFooter: "div", SheetTitle: "h2", SheetClose: "button",
  Sidebar: "aside", SidebarContent: "div", SidebarFooter: "div", SidebarHeader: "div", SidebarInput: "input",
  SidebarMenu: "ul", SidebarMenuItem: "li", SidebarMenuButton: "button", SidebarSeparator: "div", SidebarTrigger: "button",
  Table: "table", TableHeader: "thead", TableBody: "tbody", TableRow: "tr", TableHead: "th", TableCell: "td",
  TooltipTrigger: "button", TooltipContent: "div",
  Form: "form", FormItem: "div", FormLabel: "label", FormControl: "div", FormMessage: "p",
};
const PASSTHROUGH = ["Dialog", "Select", "DropdownMenu", "Popover", "Sheet", "Tooltip", "TooltipProvider", "SidebarProvider"];

// FormField usa render prop: se evalua con un campo vacio y sin error.
function FormField(props: Props): IRNode | IRNode[] {
  const render = props.render as ((a: unknown) => IRNode | IRNode[]) | undefined;
  return render ? render({ field: { name: props.name, value: "" }, fieldState: { invalid: false } }) : [];
}

const known: Record<string, unknown> = {
  FormField,
  // sin ventana: se evalua el layout de escritorio (main), que es la base de Webflow
  useMediaQuery: () => false,
  useSidebar: () => ({ open: true, setOpen: () => {}, toggleSidebar: () => {}, isMobile: false }),
  // nombres de tipo importados como valor (import { Button, ButtonProps })
  ButtonProps: undefined,
  CarouselApi: undefined,
  cn: (...a: unknown[]) => a.flat().filter((x) => typeof x === "string" && x).join(" "),
};
for (const [name, tag] of Object.entries(TAGS)) known[name] = primitive(name, tag);
for (const name of PASSTHROUGH) known[name] = passthrough(name);

// Un nombre no modelado se pinta como div generico y queda reportado, en vez de romper la evaluacion.
export const relumeUi = new Proxy(known, {
  get(target, prop: string) {
    if (prop in target) return target[prop];
    reportGeneric("@relume_io/relume-ui", prop);
    return primitive(prop, "div");
  },
});
