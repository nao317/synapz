// 日付データ調整
export function formatUtcDateTime(input: string | number | Date): string {
    const iso = new Date(input).toISOString();
    return iso.slice(0, 19).replace('T', ' ');
}

export function formatUtcDate(input: string | number | Date): string {
    return new Date(input).toISOString().slice(0, 10);
}
