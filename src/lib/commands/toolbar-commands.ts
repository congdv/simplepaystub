// Command interface
export interface Command {
  execute(): void;
  canExecute(): boolean;
}

// Base command class for toolbar actions
export abstract class ToolbarCommand implements Command {
  constructor(protected isDisabled: boolean = false) {}

  abstract execute(): void;

  canExecute(): boolean {
    return !this.isDisabled;
  }
}

// Concrete command implementations
export class LoadSampleCommand extends ToolbarCommand {
  constructor(
    private onLoadSample: () => void,
    isDisabled: boolean = false
  ) {
    super(isDisabled);
  }

  execute(): void {
    if (this.canExecute()) {
      this.onLoadSample();
    }
  }
}

export class ResetCommand extends ToolbarCommand {
  constructor(
    private onReset: () => void,
    isDisabled: boolean = false
  ) {
    super(isDisabled);
  }

  execute(): void {
    if (this.canExecute()) {
      this.onReset();
    }
  }
}

export class SaveCommand extends ToolbarCommand {
  constructor(
    private onSave: () => void,
    isDisabled: boolean = false
  ) {
    super(isDisabled);
  }

  execute(): void {
    if (this.canExecute()) {
      this.onSave();
    }
  }
}

export class DownloadCommand extends ToolbarCommand {
  constructor(
    private onDownload: () => void,
    isDisabled: boolean = false
  ) {
    super(isDisabled);
  }

  execute(): void {
    if (this.canExecute()) {
      this.onDownload();
    }
  }
}

export class SendEmailCommand extends ToolbarCommand {
  constructor(
    private onSendEmail: () => void,
    isDisabled: boolean = false
  ) {
    super(isDisabled);
  }

  execute(): void {
    if (this.canExecute()) {
      this.onSendEmail();
    }
  }
}
