import {
  SidebarSection,
  SidebarSectionTitle,
  SidebarTooltip,
} from "@/components/sidebar/right-sidebar";
import { Button } from "@notpadd/ui/components/button";
import { Sidebar, SidebarFooter } from "@notpadd/ui/components/sidebar";
import { Skeleton } from "@notpadd/ui/components/skeleton";
import { Textarea } from "@notpadd/ui/components/textarea";
import { CircleAlert } from "lucide-react";
export const RightSidebarLoading = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props} side="right" variant="floating">
      <div className="size-full p-4 flex flex-col gap-6">
        <h1 className="text-muted-foreground">Article Metadata</h1>
        <div className="flex flex-col gap-4">
          <SidebarSection>
            <SidebarSectionTitle>
              Cover image
              <SidebarTooltip content="The cover image is the image that will be displayed on the article page.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <Skeleton className="h-48 border relative border-dashed bg-muted/50 animate-pulse"></Skeleton>
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Description{" "}
              <SidebarTooltip content="The description is the text that will be displayed on the article page.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <Skeleton className="min-h-20 w-full bg-muted/50" />
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Slug{" "}
              <SidebarTooltip content="The slug is the URL of the article.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <Skeleton className="h-10 w-full bg-muted/50" />
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Tags{" "}
              <SidebarTooltip content="The tags are the tags of the article.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-full  bg-muted/50" />
            </div>
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Authors{" "}
              <SidebarTooltip content="The authors are the authors of the article.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <div className="flex flex-wrap ">
              <Skeleton className="h-10 w-full bg-muted/50" />
            </div>
          </SidebarSection>
        </div>
      </div>
      <SidebarFooter>
        <Button disabled={true} className="w-full">
          Save
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
