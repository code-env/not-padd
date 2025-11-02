import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@notpadd/ui/components/card";
import { CodeBlocks } from "@/components/clients/code-blocks";

const items = [
  {
    title: "Organization ID",
    description: "The organization ID to use in the notpadd config",
    code: "Loading...",
  },
  {
    title: "Secret Key",
    description:
      "Keep this private and secure on for usage only in your organization/workspace",
    code: "Loading...",
  },
  {
    title: "Publishable Key",
    description: "Safe to use in client-side code",
    code: "Loading...",
  },
];

export const Keys = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-none">
            <CodeBlocks
              code={item.code}
              language="bash"
              secretKey={item.title === "Secret Key"}
              showLineNumbers={false}
              copyKey={item.code}
              copyMessage={`${item.title} copied to clipboard`}
              disableCopy={true}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
