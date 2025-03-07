import { Test, TestingModule } from '@nestjs/testing';
import { JobProcessor } from '../../src/domain/job.processor';
import { JobValidator } from '../../src/domain/job.validator';
import { Job } from '../../src/domain/interfaces/scheduler.interface';

describe('JobProcessor', () => {
	let jobProcessor: JobProcessor;
	let mockJobValidator: { validateJob: jest.Mock };

	beforeEach(async () => {
		// Create mock for JobValidator
		mockJobValidator = {
			validateJob: jest.fn().mockImplementation((job: any) => {
				if (!job.name || !job.target || !job.schedule) {
					throw new Error('Invalid job data');
				}
				return true;
			})
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JobProcessor,
				{
					provide: JobValidator,
					useValue: mockJobValidator
				}
			],
		}).compile();

		jobProcessor = module.get<JobProcessor>(JobProcessor);
	});

	it('should be defined', () => {
		expect(jobProcessor).toBeDefined();
	});

	it('should process a valid job request', async () => {
		// Arrange
		const jobRequest = {
			name: 'Test Job',
			type: 'test',
			schedule: '* * * * *',
			target: {
				service: 'TestService',
				method: 'processData',
				payload: { data: 'test-data' }
			},
			status: 'active' as 'active' | 'inactive'
		};

		// Act
		const result = await jobProcessor.processJob(jobRequest);

		// Assert
		expect(result).toBeDefined();
		expect(result.name).toBe(jobRequest.name);
		expect(result.type).toBe(jobRequest.type);
		expect(result.schedule).toBe(jobRequest.schedule);
		expect(result.target).toEqual(jobRequest.target);
		expect(result.status).toBe(jobRequest.status);
		
		// Verify that validateJob was called
		expect(mockJobValidator.validateJob).toHaveBeenCalled();
		
		// Check that the first call argument contains the job request properties
		const callArg = mockJobValidator.validateJob.mock.calls[0][0];
		expect(callArg).toMatchObject(jobRequest);
	});

	it('should throw an error for invalid job data', async () => {
		// Arrange
		const invalidJobRequest = {
			// Missing required fields
			type: 'test',
			status: 'active' as 'active' | 'inactive'
		};

		// Act & Assert
		await expect(jobProcessor.processJob(invalidJobRequest as any)).rejects.toThrow('Invalid job data');
		
		// Verify that validateJob was called
		expect(mockJobValidator.validateJob).toHaveBeenCalled();
		
		// Check that the first call argument contains the invalid job request properties
		const callArg = mockJobValidator.validateJob.mock.calls[0][0];
		expect(callArg).toMatchObject(invalidJobRequest);
	});
});
