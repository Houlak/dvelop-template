/** Encapsulates API response */
export interface ApiResponse<T = unknown> {
  data: T;
  /** `true` if error, `false` otherwise */
  result: boolean;
  /** Custom error code */
  errorCode: number;
  /** Internal error message */
  message: string;
  /** Error message to display to the final user */
  showMessage: string | ShowMessage | null;
  /** `true` if appVersionObsolete, `false` otherwise */
  needUpdate: boolean;
}

type MessageLanguage = 'EN' | 'ES';

type ShowMessage = Record<MessageLanguage, string>;
