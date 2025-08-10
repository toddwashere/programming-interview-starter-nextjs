import {
  loginSchema,
  registerSchema,
  personSchema,
  noteSchema,
} from "@/lib/validations";

describe("validations", () => {
  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it("should reject short password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "123",
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe("personSchema", () => {
    it("should validate correct person data", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1-555-0123",
        company: "Acme Corp",
      };
      expect(() => personSchema.parse(validData)).not.toThrow();
    });

    it("should require firstName and lastName", () => {
      const invalidData = {
        firstName: "",
        lastName: "Doe",
      };
      expect(() => personSchema.parse(invalidData)).toThrow();
    });

    it("should allow optional fields to be empty", () => {
      const validData = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        phone: "",
        company: "",
      };
      expect(() => personSchema.parse(validData)).not.toThrow();
    });
  });

  describe("noteSchema", () => {
    it("should validate correct note data", () => {
      const validData = {
        title: "Meeting Notes",
        content: "Discussed project timeline",
      };
      expect(() => noteSchema.parse(validData)).not.toThrow();
    });

    it("should require title and content", () => {
      const invalidData = {
        title: "",
        content: "Some content",
      };
      expect(() => noteSchema.parse(invalidData)).toThrow();
    });
  });
});
