import { html } from "htm/preact";
import { cn } from "../cn.js";

const Card = ({ className, ...props }) => html` <div className=${cn("rounded-lg bg-card text-card-foreground", className)} ...${props} /> `;
Card.displayName = "Card";

const CardHeader = ({ className, ...props }) => html` <div className=${cn("flex flex-col space-y-1.5 p-6", className)} ...${props} /> `;

CardHeader.displayName = "CardHeader";

const CardTitle = ({ className, ...props }) => html` <h3 className=${cn("text-2xl font-semibold leading-none tracking-tight", className)} ...${props} /> `;
CardTitle.displayName = "CardTitle";

const CardDescription = ({ className, ...props }) => html` <p className=${cn("text-sm text-muted-foreground", className)} ...${props} /> `;
CardDescription.displayName = "CardDescription";

const CardContent = ({ className, ...props }) => html` <div className=${cn("p-6 pt-0", className)} ...${props} /> `;
CardContent.displayName = "CardContent";

const CardFooter = ({ className, ...props }) => html` <div className=${cn("flex items-center p-6 pt-0", className)} ...${props} /> `;
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
