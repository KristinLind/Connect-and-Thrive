import assert from "node:assert/strict";
import test from "node:test";
import { parseGroupInput } from "../src/lib/groups/group-input.ts";

test("group creation trims and retains all fields needed by My Groups", () => {
    assert.deepEqual(
        parseGroupInput({
            name: "  Hiking Together  ",
            description: "  A weekly outdoor group.  ",
            meetingSchedule: "  Saturdays at 9:00 AM  ",
            location: "  Provo Canyon  ",
        }),
        {
            name: "Hiking Together",
            description: "A weekly outdoor group.",
            meetingSchedule: "Saturdays at 9:00 AM",
            location: "Provo Canyon",
        },
    );
});

test("group creation rejects missing, blank, non-string, and oversized fields", () => {
    assert.equal(parseGroupInput(null), null);
    assert.equal(parseGroupInput([]), null);
    assert.equal(parseGroupInput({ name: "Hiking" }), null);
    assert.equal(
        parseGroupInput({
            name: "Hiking",
            description: "Group",
            meetingSchedule: " ",
            location: "Provo",
        }),
        null,
    );
    assert.equal(
        parseGroupInput({
            name: "H".repeat(121),
            description: "Group",
            meetingSchedule: "Saturdays",
            location: "Provo",
        }),
        null,
    );
});
