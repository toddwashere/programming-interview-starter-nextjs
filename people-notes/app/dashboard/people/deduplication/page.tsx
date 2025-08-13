"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  findDuplicateContacts,
  mergeContacts,
  Contact,
} from "@/lib/contact-deduplication";
import { Badge } from "@/components/ui/badge";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
}

function getFullName(contact: Contact) {
  return `${contact.firstName} ${contact.lastName}`;
}

export default function DeduplicationPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [duplicates, setDuplicates] = useState<Contact[][]>([]);
  const [unique, setUnique] = useState<Contact[]>([]);
  const [mergedContacts, setMergedContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    try {
      const response = await fetch("/api/people");
      if (response.ok) {
        const data = await response.json();
        setPeople(data);
        analyzeDuplicates(data);
      }
    } catch (error) {
      console.error("Failed to load people:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeDuplicates = (peopleData: Person[]) => {
    setProcessing(true);

    // Convert Person to Contact format
    const contacts: Contact[] = peopleData.map((person) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email || undefined,
      phone: person.phone || undefined,
      company: person.company || undefined,
    }));

    const result = findDuplicateContacts(contacts);
    setDuplicates(result.duplicates);
    setUnique(result.unique);

    // Generate merged contacts for preview
    const merged = result.duplicates.map((duplicateGroup) =>
      mergeContacts(duplicateGroup)
    );
    setMergedContacts(merged);

    setProcessing(false);
  };

  const handleMergeDuplicates = async () => {
    // This would implement the actual merge logic with API calls
    console.log("Merging duplicates:", mergedContacts);
    // TODO: Implement API calls to merge contacts
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading contacts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Deduplication</h1>
          <p className="text-muted-foreground mt-2">
            Find and merge duplicate contacts in your database
          </p>
        </div>
        {duplicates.length > 0 && (
          <Button onClick={handleMergeDuplicates} size="lg">
            Merge All Duplicates
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{people.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duplicate Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {duplicates.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {unique.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {processing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-lg">
                Analyzing contacts for duplicates...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {duplicates.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Duplicate Groups</h2>

          {duplicates.map((duplicateGroup, groupIndex) => (
            <Card key={groupIndex} className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">
                    Duplicate Group {groupIndex + 1}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {duplicateGroup.length} contacts
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Original Contacts</h4>
                    <div className="space-y-2">
                      {duplicateGroup.map((contact, contactIndex) => (
                        <div
                          key={contactIndex}
                          className="p-3 border rounded-lg bg-red-50"
                        >
                          <div className="font-medium">
                            {getFullName(contact)}
                          </div>
                          {contact.email && (
                            <div className="text-sm text-muted-foreground">
                              📧 {contact.email}
                            </div>
                          )}
                          {contact.phone && (
                            <div className="text-sm text-muted-foreground">
                              📞 {contact.phone}
                            </div>
                          )}
                          {contact.company && (
                            <div className="text-sm text-muted-foreground">
                              🏢 {contact.company}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Merged Result</h4>
                    <div className="p-3 border rounded-lg bg-green-50">
                      <div className="font-medium">
                        {getFullName(mergedContacts[groupIndex])}
                      </div>
                      {mergedContacts[groupIndex].email && (
                        <div className="text-sm text-muted-foreground">
                          📧 {mergedContacts[groupIndex].email}
                        </div>
                      )}
                      {mergedContacts[groupIndex].phone && (
                        <div className="text-sm text-muted-foreground">
                          📞 {mergedContacts[groupIndex].phone}
                        </div>
                      )}
                      {mergedContacts[groupIndex].company && (
                        <div className="text-sm text-muted-foreground">
                          🏢 {mergedContacts[groupIndex].company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {duplicates.length === 0 && !processing && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-lg font-medium text-green-600">
                🎉 No duplicates found!
              </div>
              <p className="text-muted-foreground mt-2">
                All your contacts appear to be unique.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {unique.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Unique Contacts</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {unique.slice(0, 12).map((contact, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium">{getFullName(contact)}</div>
                    {contact.email && (
                      <div className="text-sm text-muted-foreground">
                        {contact.email}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {unique.length > 12 && (
                <div className="text-center mt-4 text-muted-foreground">
                  ... and {unique.length - 12} more unique contacts
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
