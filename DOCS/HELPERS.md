# HELPERS Documentation

This document provides an overview of the helper functions located in `/src/lib/helper.ts`. These utility functions are used throughout the project for error handling, user role manipulation, and time calculations.

---

## 1. extractErrorMessage

**Purpose:**  
Extracts a meaningful error message from an error object.  
If the provided error is not an instance of the Error class, a default message is returned.

**Usage Example:**

```typescript
const message = extractErrorMessage({
    error: someError,
    defaultMessage: "An unexpected error occurred."
});
```

**Inputs:**

- **error:** An unknown error object.
- **defaultMessage:** A string to use if the error does not contain a message.

**Output:**  
Returns a string containing the error message or the default message.

---

## 2. urlToUserRole

**Purpose:**  
Extracts the last segment of a URL and converts it to uppercase.  
This is useful for mapping URL segments to user roles.

**Usage Example:**

```typescript
const role = urlToUserRole("https://example.com/login/client");
// Returns "CLIENT"
```

**Input:**  
- **url:** A URL string.

**Output:**  
Returns an uppercase string representing the user role.

---

## 3. UserRoleToLowerCaseString

**Purpose:**  
Converts a user role (either a string or a UserRole enum value) to a lowercase string.  
This helps in standardizing role strings for comparison or URL usage.

**Usage Example:**

```typescript
const roleLower = UserRoleToLowerCaseString("CLIENT");
// Returns "client"
```

**Input:**  
- **role:** A string or UserRole enum value.

**Output:**  
Returns a lowercase string.

---

## 4. expiryInMinutes

**Purpose:**  
Calculates a future expiration timestamp by adding a specified number of minutes to the current time.

**Usage Example:**

```typescript
const expiresAt = expiryInMinutes(5);
// Returns a Date object set 5 minutes from now
```

**Input:**  
- **minutes:** A number indicating how many minutes to add.

**Output:**  
Returns a Date object representing the expiration time.

---

*End of HELPERS Documentation*