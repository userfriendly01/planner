export class FormFieldUtil {
  public static getValue<T>(record: T, key: string): string {
    return `${record?.[key as keyof T] || ""}`;
  }
}