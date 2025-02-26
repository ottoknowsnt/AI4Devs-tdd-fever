import { validateCandidateData } from './validator';

describe('validateCandidateData', () => {
  // Happy path
  it('should validate complete valid candidate data without errors', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '612345678',
      address: 'Test Address',
      educations: [
        {
          institution: 'University',
          title: 'Computer Science',
          startDate: '2018-01-01',
          endDate: '2022-01-01',
        },
      ],
      workExperiences: [
        {
          company: 'Tech Company',
          position: 'Developer',
          description: 'Developing software',
          startDate: '2022-02-01',
          endDate: '2023-01-01',
        },
      ],
      cv: {
        filePath: '/path/to/file.pdf',
        fileType: 'application/pdf',
      },
    };

    expect(() => validateCandidateData(validData)).not.toThrow();
  });

  it('should validate data with minimum required fields', () => {
    const minimalData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(minimalData)).not.toThrow();
  });

  // ID present - early return
  it('should skip validation when id is present (edit mode)', () => {
    const dataWithId = {
      id: '123',
      firstName: '', // Invalid, but should be ignored due to id presence
      lastName: '', // Invalid, but should be ignored due to id presence
      email: 'not-an-email', // Invalid, but should be ignored due to id presence
    };

    expect(() => validateCandidateData(dataWithId)).not.toThrow();
  });

  // First name validation
  it('should throw error when firstName is missing', () => {
    const data = {
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid name');
  });

  it('should throw error when firstName is too short', () => {
    const data = {
      firstName: 'J',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid name');
  });

  it('should throw error when firstName is too long', () => {
    const data = {
      firstName: 'J'.repeat(101),
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid name');
  });

  it('should throw error when firstName contains invalid characters', () => {
    const data = {
      firstName: 'John123',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid name');
  });

  // Last name validation
  it('should throw error when lastName is missing', () => {
    const data = {
      firstName: 'John',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid name');
  });

  // Email validation
  it('should throw error when email is missing', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid email');
  });

  it('should throw error when email format is invalid', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'not-an-email',
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid email');
  });

  // Phone validation
  it('should throw error when phone format is invalid', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '12345', // Invalid phone number
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid phone');
  });

  it('should validate candidate when phone is not provided', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };

    expect(() => validateCandidateData(data)).not.toThrow();
  });

  // Address validation
  it('should throw error when address exceeds maximum length', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: 'A'.repeat(101),
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid address');
  });

  // Educations validation
  it('should throw error when education institution is missing', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [
        {
          title: 'Computer Science',
          startDate: '2018-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid institution');
  });

  it('should throw error when education title is missing', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [
        {
          institution: 'University',
          startDate: '2018-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid title');
  });

  it('should throw error when education startDate is invalid', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [
        {
          institution: 'University',
          title: 'Computer Science',
          startDate: '2018/01/01', // Wrong format
        },
      ],
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid date');
  });

  // Work experiences validation
  it('should throw error when work experience company is missing', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      workExperiences: [
        {
          position: 'Developer',
          startDate: '2022-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid company');
  });

  it('should throw error when work experience position is missing', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      workExperiences: [
        {
          company: 'Tech Company',
          startDate: '2022-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid position');
  });

  it('should throw error when work experience description is too long', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      workExperiences: [
        {
          company: 'Tech Company',
          position: 'Developer',
          description: 'A'.repeat(201),
          startDate: '2022-01-01',
        },
      ],
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid description');
  });

  // CV validation
  it('should throw error when CV data is invalid', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      cv: {
        // Missing filePath
        fileType: 'application/pdf',
      },
    };

    expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
  });

  // Empty collections
  it('should validate data with empty educations array', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      educations: [],
    };

    expect(() => validateCandidateData(data)).not.toThrow();
  });

  it('should validate data with empty workExperiences array', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      workExperiences: [],
    };

    expect(() => validateCandidateData(data)).not.toThrow();
  });
});
