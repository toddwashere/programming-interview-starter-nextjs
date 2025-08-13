import {
  findDuplicateContacts,
  mergeContacts,
  Contact,
} from "./contact-deduplication";

describe("Contact Deduplication", () => {
  const sampleContacts: Contact[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      phone: "555-123-4567",
    },
    {
      id: "2",
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
    },
    {
      id: "3",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "555-987-6543",
    },
    {
      id: "4",
      firstName: "Jon",
      lastName: "Smith",
      email: "jon@example.com",
      phone: "555-123-4567",
    },
    {
      id: "5",
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@company.com",
      phone: "555-111-2222",
    },
  ];

  describe("findDuplicateContacts", () => {
    describe("When checking emails", () => {
      it("should find exact email matches", () => {
        const contacts = [
          { firstName: "John", lastName: "A", email: "john@test.com" },
          { firstName: "John", lastName: "B", email: "john@test.com" },
          { firstName: "Jane", lastName: "Doe", email: "jane@test.com" },
        ];
        const result = findDuplicateContacts(contacts);
        expect(result.duplicates).toHaveLength(1);
        expect(result.duplicates[0]).toHaveLength(2);
        expect(result.unique).toHaveLength(1);
      });
      //   it("should be case insensitive", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith", email: "john@test.com" },
      //       { firstName: "Jane", lastName: "Doe", email: "JOHN@TEST.COM" },
      //       { firstName: "Bob", lastName: "Johnson", email: "bob@test.com" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     expect(result.duplicates).toHaveLength(1);
      //     expect(result.duplicates[0]).toHaveLength(2);
      //     expect(result.unique).toHaveLength(1);
      //   });
      //   it("should not match when email is falsey", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith", email: "" },
      //       { firstName: "Jane", lastName: "Doe", email: "" },
      //       { firstName: "Bob", lastName: "Johnson" }, // No email property
      //       { firstName: "Alice", lastName: "Wilson", email: "alice@test.com" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     expect(result.duplicates).toHaveLength(0);
      //     expect(result.unique).toHaveLength(4);
      //   });
    });

    describe("When Checking phone numbers", () => {
      //   it("should ignore formatting", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith", phone: "555-123-4567" },
      //       { firstName: "Jane", lastName: "Doe", phone: "(555) 123-4567" },
      //       { firstName: "Bob", lastName: "Johnson", phone: "555-999-8888" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     expect(result.duplicates).toHaveLength(1);
      //     expect(result.duplicates[0]).toHaveLength(2);
      //   });
      //   it("should assume country code is '1' and match if country code is left out", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith", phone: "555-123-4567" },
      //       { firstName: "Jane", lastName: "Doe", phone: "+1-555-123-4567" },
      //       { firstName: "Bob", lastName: "Johnson", phone: "1-555-123-4567" },
      //       { firstName: "Alice", lastName: "Wilson", phone: "555-999-8888" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     expect(result.duplicates).toHaveLength(1);
      //     expect(result.duplicates[0]).toHaveLength(3);
      //     expect(result.unique).toHaveLength(1);
      //   });
    });

    describe("when checking first and last name", () => {
      //   it("should only match on full name", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith" },
      //       { firstName: "John", lastName: "Johnson" }, // Same first name, different last
      //       { firstName: "Mike", lastName: "Smith" }, // Different first name, same last
      //       { firstName: "Jane", lastName: "Doe" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     // Should not find any duplicates since no full names match
      //     expect(result.duplicates).toHaveLength(0);
      //     expect(result.unique).toHaveLength(4);
      //   });
      //   it("should find similar name matches", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith" },
      //       { firstName: "Jon", lastName: "Smith" },
      //       { firstName: "Jane", lastName: "Doe" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     expect(result.duplicates).toHaveLength(1);
      //     expect(result.duplicates[0]).toHaveLength(2);
      //   });
      //   it("should not match partial names", () => {
      //     const contacts = [
      //       { firstName: "Robert", lastName: "Johnson" },
      //       { firstName: "Rob", lastName: "Johnson" },
      //       { firstName: "Robert", lastName: "Jones" }, // Same first name, different last
      //       { firstName: "Mike", lastName: "Johnson" }, // Different first name, same last
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     // Should not find duplicates for partial matches
      //     expect(result.duplicates).toHaveLength(0);
      //     expect(result.unique).toHaveLength(4);
      //   });
      //   it("should be case insensitive", () => {
      //     const contacts = [
      //       { firstName: "John", lastName: "Smith" },
      //       { firstName: "JOHN", lastName: "SMITH" },
      //       { firstName: "john", lastName: "smith" },
      //       { firstName: "Jane", lastName: "Doe" },
      //     ];
      //     const result = findDuplicateContacts(contacts);
      //     expect(result.duplicates).toHaveLength(1);
      //     expect(result.duplicates[0]).toHaveLength(3);
      //     expect(result.unique).toHaveLength(1);
      //   });
    });

    // it("should handle multiple matching criteria", () => {
    //   const result = findDuplicateContacts(sampleContacts);

    //   // Should find duplicates based on email, phone, or name similarity
    //   expect(result.duplicates.length).toBeGreaterThan(0);
    //   expect(result.unique.length).toBeLessThan(sampleContacts.length);
    // });

    it("should return all contacts as unique when no matches found", () => {
      const contacts = [
        {
          firstName: "John",
          lastName: "Smith",
          email: "john@test.com",
          phone: "555-1111",
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@test.com",
          phone: "555-2222",
        },
        {
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@test.com",
          phone: "555-3333",
        },
      ];

      const result = findDuplicateContacts(contacts);

      expect(result.duplicates).toHaveLength(0);
      expect(result.unique).toHaveLength(3);
    });
  });

  //   describe("mergeContacts", () => {
  //     it("should throw error for empty array", () => {
  //       expect(() => mergeContacts([])).toThrow(
  //         "Cannot merge empty contact list"
  //       );
  //     });

  //     it("should return single contact unchanged", () => {
  //       const contact = {
  //         firstName: "John",
  //         lastName: "Smith",
  //         email: "john@test.com",
  //       };
  //       const result = mergeContacts([contact]);
  //       expect(result).toEqual(contact);
  //     });

  //     it("should merge contacts keeping most complete information", () => {
  //       const contacts = [
  //         { firstName: "John", lastName: "Smith", email: "john@test.com" },
  //         { firstName: "John", lastName: "Smith", phone: "555-1234" },
  //         {
  //           firstName: "John",
  //           lastName: "Smith",
  //           email: "john@test.com",
  //           phone: "555-1234",
  //           company: "Acme Corp",
  //         },
  //       ];

  //       const result = mergeContacts(contacts);

  //       expect(result.firstName).toBe("John");
  //       expect(result.lastName).toBe("Smith");
  //       expect(result.email).toBe("john@test.com");
  //       expect(result.phone).toBe("555-1234");
  //       expect(result.company).toBe("Acme Corp");
  //     });

  //     it("should prefer non-empty values when merging", () => {
  //       const contacts = [
  //         { firstName: "John", lastName: "", email: "", phone: "555-1234" },
  //         {
  //           firstName: "John",
  //           lastName: "Smith",
  //           email: "john@test.com",
  //           phone: "",
  //         },
  //       ];

  //       const result = mergeContacts(contacts);

  //       expect(result.firstName).toBe("John");
  //       expect(result.lastName).toBe("Smith"); // Longer/more complete name
  //       expect(result.email).toBe("john@test.com");
  //       expect(result.phone).toBe("555-1234");
  //     });
  //   });
});
