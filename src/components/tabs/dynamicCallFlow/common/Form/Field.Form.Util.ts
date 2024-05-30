export class FieldFormUtil {
  public static getValue<T>(record: T, key: string): string {
    return `${record?.[key as keyof T] || "record is undefined"}`;
  }
}