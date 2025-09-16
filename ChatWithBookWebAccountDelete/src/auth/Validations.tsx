export interface LoginFormData {
  email: string;
  password: string;
}

export interface VerifyEmailFormData {
  username: string;
  email: string;
  password: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export interface ValidationEmailErrors {
  username?: string;
  email?: string;
  password?: string;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  organization: {
    name: string;
    slug: string;
    domain: string;
    allow_public_signup: boolean;
  };
}

export interface ValidationErrorsSingUp {
  [key: string]: string;
}

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is not valid.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};

export const validateSignUpForm = (
  data: SignUpFormData,
  role: "user" | "moderator" | "admin"
): ValidationErrors => {
  const errors: ValidationErrorsSingUp = {};

  // username
  if (!data.username) {
    errors.username = "Username is required.";
  } else {
    if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters long.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(data.username)) {
      errors.username =
        "Username can only contain letters, numbers, hyphens, and underscores.";
    }
  }

  // email
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is not valid.";
  }

  // password
  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(data.password)) {
    errors.password = "Password must contain at least one lowercase letter.";
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = "Password must contain at least one digit.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
    errors.password = "Password must contain at least one special character.";
  }

  // extra org fields only when role = moderator
  if (role === "moderator") {
    if (!data.organization.name || data.organization.name.trim().length < 2) {
      errors["organization.name"] =
        "Organization name must be at least 2 characters long.";
    }
    if (!data.organization.slug) {
      errors["organization.slug"] = "Organization slug is required.";
    }
    if (!data.organization.domain) {
      errors["organization.domain"] = "Organization domain is required.";
    }
  }

  return errors;
};



export const validateVerifyEmailForm = (data: VerifyEmailFormData): ValidationEmailErrors => {
  const errors: ValidationEmailErrors = {};

    if (!data.username) {
    errors.username = "Username is required.";
  } else {
    if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters long.";
    } else if (!/^[A-Za-z0-9_-]+$/.test(data.username)) {
      errors.username =
        "Username can only contain letters, numbers, hyphens, and underscores.";
    }
  }

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is not valid.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};
