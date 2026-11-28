export type GroupInput = {
    name: string;
    description: string;
    meetingSchedule: string;
    location: string;
};

function readRequiredText(value: unknown, maximumLength: number) {
    if (typeof value !== "string") return null;

    const normalized = value.trim();
    if (!normalized || normalized.length > maximumLength) return null;

    return normalized;
}

export function parseGroupInput(value: unknown): GroupInput | null {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return null;
    }

    const input = value as Record<string, unknown>;
    const name = readRequiredText(input.name, 120);
    const description = readRequiredText(input.description, 5000);
    const meetingSchedule = readRequiredText(input.meetingSchedule, 500);
    const location = readRequiredText(input.location, 300);

    if (!name || !description || !meetingSchedule || !location) return null;

    return { name, description, meetingSchedule, location };
}
