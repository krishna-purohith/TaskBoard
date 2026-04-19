import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SpinnerCustom({ loadingMessage }: { loadingMessage: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner data-icon="inline-start" />
        {loadingMessage}
      </Button>
    </div>
  );
}
