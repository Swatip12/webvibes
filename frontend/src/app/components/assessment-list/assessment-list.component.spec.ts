import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AssessmentListComponent } from './assessment-list.component';
import { AssessmentService } from '../../services/assessment.service';
import { StudentAssessmentDTO } from '../../models/dtos';

/**
 * Bug Condition Exploration Test
 *
 * Property 1: Bug Condition — Empty Success Response Sets paymentGated True
 *
 * This test MUST FAIL on unfixed code. Failure confirms the bug exists.
 * The bug: `this.paymentGated = data.length === 0` in the success handler
 * incorrectly sets paymentGated = true when the API returns an empty array (HTTP 200).
 *
 * Validates: Requirements 1.1, 1.2
 */
describe('AssessmentListComponent', () => {
  let component: AssessmentListComponent;
  let fixture: ComponentFixture<AssessmentListComponent>;
  let assessmentService: jasmine.SpyObj<AssessmentService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const assessmentServiceSpy = jasmine.createSpyObj('AssessmentService', ['getMyAssessments']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Default: return empty array so ngOnInit doesn't throw
    assessmentServiceSpy.getMyAssessments.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [AssessmentListComponent],
      providers: [
        { provide: AssessmentService, useValue: assessmentServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    assessmentService = TestBed.inject(AssessmentService) as jasmine.SpyObj<AssessmentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentListComponent);
    component = fixture.componentInstance;
    // Do NOT call fixture.detectChanges() here — we control loadAssessments() manually
  });

  /**
   * BUG CONDITION EXPLORATION TEST
   *
   * Property 1: For any HTTP 200 response with an empty array,
   * paymentGated MUST be false after loadAssessments() completes.
   *
   * On UNFIXED code this FAILS with: Expected true to be false
   * Counterexample: getMyAssessments() returns [] → paymentGated is true (wrong)
   *
   * Validates: Requirements 1.1, 1.2
   */
  it('should NOT set paymentGated to true when getMyAssessments returns an empty array (HTTP 200)', () => {
    // Arrange: mock returns empty array — a valid HTTP 200 success response
    assessmentService.getMyAssessments.and.returnValue(of([]));

    // Act
    component.loadAssessments();

    // Assert: paymentGated must be false — empty array is NOT a payment gate condition
    // This assertion FAILS on unfixed code because the bug sets paymentGated = data.length === 0 = true
    expect(component.paymentGated).toBe(false);
  });

  /**
   * Preservation — Non-Bug-Condition Paths Behave Correctly
   *
   * These tests verify that all code paths NOT involving the bug condition
   * behave correctly on the UNFIXED code. All tests in this block MUST PASS
   * on unfixed code — they document the baseline behavior to preserve.
   *
   * Validates: Requirements 3.1, 3.2, 3.3
   */
  describe('Preservation — non-bug-condition paths', () => {

    /**
     * Property 2: non-empty HTTP 200 never sets paymentGated to true
     *
     * For any non-empty array returned with HTTP 200, paymentGated is always false.
     * isBugCondition is false when data.length > 0, so this path is unaffected by the bug.
     *
     * Validates: Requirements 3.1
     */
    it('Property 2: non-empty HTTP 200 never sets paymentGated to true — single assessment', () => {
      const oneAssessment: StudentAssessmentDTO = {
        studentAssessmentId: 1,
        assessmentId: 10,
        title: 'Test Assessment',
        type: 'TECHNICAL_MCQ',
        status: 'PENDING'
      };
      assessmentService.getMyAssessments.and.returnValue(of([oneAssessment]));

      component.loadAssessments();

      expect(component.paymentGated).toBe(false);
      expect(component.assessments.length).toBe(1);
    });

    it('Property 2: non-empty HTTP 200 never sets paymentGated to true — multiple assessments', () => {
      const a1: StudentAssessmentDTO = { studentAssessmentId: 1, assessmentId: 10, title: 'MCQ', type: 'TECHNICAL_MCQ', status: 'PENDING' };
      const a2: StudentAssessmentDTO = { studentAssessmentId: 2, assessmentId: 11, title: 'Aptitude', type: 'APTITUDE_TEST', status: 'UPCOMING' };
      const a3: StudentAssessmentDTO = { studentAssessmentId: 3, assessmentId: 12, title: 'Machine', type: 'MACHINE_TEST', status: 'COMPLETED' };
      assessmentService.getMyAssessments.and.returnValue(of([a1, a2, a3]));

      component.loadAssessments();

      expect(component.paymentGated).toBe(false);
      expect(component.assessments.length).toBe(3);
    });

    /**
     * HTTP 403 → paymentGated === true, errorMessage === ''
     *
     * The error handler correctly sets paymentGated = true on 403.
     * This behavior must be preserved after the fix.
     *
     * Validates: Requirements 2.2, 3.2
     */
    it('HTTP 403 sets paymentGated to true and leaves errorMessage empty', () => {
      assessmentService.getMyAssessments.and.returnValue(throwError(() => ({ status: 403 })));

      component.loadAssessments();

      expect(component.paymentGated).toBe(true);
      expect(component.errorMessage).toBe('');
    });

    /**
     * HTTP 500 → paymentGated === false, errorMessage set to generic string
     *
     * Non-403 errors show the generic error message and do not gate payment.
     * This behavior must be preserved after the fix.
     *
     * Validates: Requirements 3.3
     */
    it('HTTP 500 sets errorMessage and leaves paymentGated false', () => {
      assessmentService.getMyAssessments.and.returnValue(throwError(() => ({ status: 500 })));

      component.loadAssessments();

      expect(component.paymentGated).toBe(false);
      expect(component.errorMessage).toBe('Failed to load assessments. Please try again.');
    });

    /**
     * isLoading is false after success path completes
     *
     * Validates: Requirements 3.1
     */
    it('isLoading is false after success path completes', () => {
      assessmentService.getMyAssessments.and.returnValue(of([]));

      component.loadAssessments();

      expect(component.isLoading).toBe(false);
    });

    /**
     * isLoading is false after error path completes
     *
     * Validates: Requirements 3.3
     */
    it('isLoading is false after error path completes', () => {
      assessmentService.getMyAssessments.and.returnValue(throwError(() => ({ status: 500 })));

      component.loadAssessments();

      expect(component.isLoading).toBe(false);
    });
  });
});
