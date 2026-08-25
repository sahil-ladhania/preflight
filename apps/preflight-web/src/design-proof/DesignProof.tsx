/**
 * DesignProof — scratch controls for shell states.
 * Why: reach toast stack and RERR without wiring product screens.
 */

import { useState, type ReactElement } from "react";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useToastContext } from "@/features/shell/ToastHost";

function CrashTrigger({ shouldThrow }: { shouldThrow: boolean }): ReactElement {
  if (shouldThrow) {
    throw new Error("Design proof render crash");
  }

  return (
    <p className="text-caption text-fg-muted">
      Click &quot;Trigger render crash&quot; to show RERR.
    </p>
  );
}

export function DesignProof(): ReactElement {
  const { enqueue } = useToastContext();
  const [shouldThrow, setShouldThrow] = useState<boolean>(false);

  const handleEnqueueToasts = (): void => {
    // Will enqueue three toasts for the global toast host.
    enqueue("Toast 1");
    enqueue("Toast 2");
    enqueue("Toast 3");
  };

  const handleTriggerCrash = (): void => {
    // Will throw inside the outlet error boundary.
    setShouldThrow(true);
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Shell states</h1>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={handleEnqueueToasts}>
          Enqueue three toasts
        </Button>
        <Button type="button" variant="outline" onClick={handleTriggerCrash}>
          Trigger render crash
        </Button>
      </div>
      <CrashTrigger shouldThrow={shouldThrow} />
      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-ui font-semibold text-fg">Assets list states</h2>
        <Link to="/design-proof/assets-list" className="text-ui text-primary underline">
          Open assets list state variants
        </Link>
      </section>
      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-ui font-semibold text-fg">Assets detail states</h2>
        <Link to="/design-proof/assets-detail" className="text-ui text-primary underline">
          Open assets detail state variants
        </Link>
      </section>
      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-ui font-semibold text-fg">Campaign states</h2>
        <Link to="/design-proof/campaign" className="text-ui text-primary underline">
          Open campaign state variants
        </Link>
      </section>
      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-ui font-semibold text-fg">Rulebook states</h2>
        <Link to="/design-proof/rulebook" className="text-ui text-primary underline">
          Open rulebook state variants
        </Link>
      </section>
      <section className="flex flex-col gap-2 border-t border-border pt-4">
        <h2 className="text-ui font-semibold text-fg">Workbench states</h2>
        <Link to="/design-proof/workbench" className="text-ui text-primary underline">
          Open workbench state variants
        </Link>
      </section>
    </div>
  );
}
