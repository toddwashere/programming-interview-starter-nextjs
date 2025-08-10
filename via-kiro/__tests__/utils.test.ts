import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });

    it("should handle conditional classes", () => {
      expect(cn("base-class", true && "conditional-class")).toBe(
        "base-class conditional-class"
      );
      expect(cn("base-class", false && "conditional-class")).toBe("base-class");
    });

    it("should handle undefined and null values", () => {
      expect(cn("base-class", undefined, null)).toBe("base-class");
    });
  });
});
