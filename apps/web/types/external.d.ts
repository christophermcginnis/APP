declare module "resend" {
  export interface SendEmailOptions {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    [key: string]: unknown;
  }

  export type ResendEmailResult = {
    id?: string;
    error?: { message: string } | null;
  };

  export class Resend {
    constructor(apiKey?: string);
    emails: {
      send(options: SendEmailOptions): Promise<ResendEmailResult>;
    };
  }
}

declare module "@prisma/client" {
  export class PrismaClient {
    constructor(...args: any[]);
    $disconnect(): Promise<void>;
    $connect(): Promise<void>;
    [key: string]: any;
  }
}
