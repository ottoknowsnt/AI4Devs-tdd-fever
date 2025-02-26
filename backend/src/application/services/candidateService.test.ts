import { addCandidate } from './candidateService';
import { validateCandidateData } from '../validator';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';

// Mock dependencies
jest.mock('../validator');
jest.mock('../../domain/models/Candidate');
jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');

describe('candidateService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    (validateCandidateData as jest.Mock).mockImplementation(() => undefined);
    (Candidate.prototype.save as jest.Mock).mockResolvedValue({ id: 1 });
    (Education.prototype.save as jest.Mock).mockResolvedValue({});
    (WorkExperience.prototype.save as jest.Mock).mockResolvedValue({});
    (Resume.prototype.save as jest.Mock).mockResolvedValue({});
  });

  describe('addCandidate', () => {
    // Happy paths
    it('should create a new candidate with all data', async () => {
      const candidateData = {
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

      const result = await addCandidate(candidateData);

      // Verify validation was called
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);

      // Verify Candidate was instantiated and saved
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(Candidate.prototype.save).toHaveBeenCalled();

      // Verify Education was saved
      expect(Education).toHaveBeenCalledWith(candidateData.educations[0]);
      expect(Education.prototype.save).toHaveBeenCalled();

      // Verify WorkExperience was saved
      expect(WorkExperience).toHaveBeenCalledWith(
        candidateData.workExperiences[0],
      );
      expect(WorkExperience.prototype.save).toHaveBeenCalled();

      // Verify Resume was saved
      expect(Resume).toHaveBeenCalledWith(candidateData.cv);
      expect(Resume.prototype.save).toHaveBeenCalled();

      // Verify result
      expect(result).toEqual({ id: 1 });
    });

    it('should create a new candidate with minimum data', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      const result = await addCandidate(candidateData);

      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(Candidate).toHaveBeenCalledWith(candidateData);
      expect(Candidate.prototype.save).toHaveBeenCalled();

      // No education, work experience or CV should be saved
      expect(Education).not.toHaveBeenCalled();
      expect(WorkExperience).not.toHaveBeenCalled();
      expect(Resume).not.toHaveBeenCalled();

      expect(result).toEqual({ id: 1 });
    });

    // Edge cases
    it('should throw error when validation fails', async () => {
      const error = new Error('Validation error');
      (validateCandidateData as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const candidateData = { firstName: 'Invalid' };

      await expect(addCandidate(candidateData)).rejects.toThrow(
        'Error: Validation error',
      );
      expect(validateCandidateData).toHaveBeenCalledWith(candidateData);
      expect(Candidate).not.toHaveBeenCalled();
    });

    it('should handle duplicate email error', async () => {
      (Candidate.prototype.save as jest.Mock).mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed on the fields: (`email`)',
      });

      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
      };

      await expect(addCandidate(candidateData)).rejects.toThrow(
        'The email already exists in the database',
      );
    });

    it('should handle other database errors', async () => {
      const dbError = new Error('Database connection error');
      (Candidate.prototype.save as jest.Mock).mockRejectedValue(dbError);

      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      await expect(addCandidate(candidateData)).rejects.toThrow(dbError);
    });

    it('should handle empty collections', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [],
        workExperiences: [],
      };

      await addCandidate(candidateData);

      expect(Education).not.toHaveBeenCalled();
      expect(WorkExperience).not.toHaveBeenCalled();
    });

    it('should handle empty CV object', async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        cv: {},
      };

      await addCandidate(candidateData);

      expect(Resume).not.toHaveBeenCalled();
    });

    it("should update candidate's collections after saving related entities", async () => {
      const candidateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        educations: [
          {
            institution: 'University',
            title: 'Degree',
            startDate: '2020-01-01',
          },
        ],
        workExperiences: [
          { company: 'Company', position: 'Position', startDate: '2020-01-01' },
        ],
        cv: { filePath: '/path/to/cv.pdf', fileType: 'application/pdf' },
      };

      const candidateInstance = new Candidate(candidateData);
      candidateInstance.education = [];
      candidateInstance.workExperience = [];
      candidateInstance.resumes = [];

      await addCandidate(candidateData);

      // Check if arrays were updated with new instances
      expect(candidateInstance.education.length).toBe(1);
      expect(candidateInstance.workExperience.length).toBe(1);
      expect(candidateInstance.resumes.length).toBe(1);
    });
  });
});
