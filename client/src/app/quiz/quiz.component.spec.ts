import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';  
import { QuizComponent } from './quiz.component';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizComponent],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize productType as an empty string', () => {
    expect(component.productType).toBe('');
  });

  it('should initialize eyeColor as an empty string', () => {
    expect(component.eyeColor).toBe('');
  });

  it('should initialize skinTone as an empty string', () => {
    expect(component.skinTone).toBe('');
  });

  it('should initialize skinType as an empty string', () => {
    expect(component.skinType).toBe('');
  });

  it('should initialize hairColor as an empty string', () => {
    expect(component.hairColor).toBe('');
  });

  it('should have correct product options', () => {
    expect(component.productOptions.length).toBeGreaterThan(0);
    expect(component.productOptions).toContain('Makeup');
  });

  it('should have correct eye color options', () => {
    expect(component.eyeColors.length).toBeGreaterThan(0);
    expect(component.eyeColors).toContain('Brown');
  });

  it('should have correct skin tone options', () => {
    expect(component.skinTones.length).toBeGreaterThan(0);
    expect(component.skinTones).toContain('Light');
  });

  it('should have correct skin type options', () => {
    expect(component.skinTypes.length).toBeGreaterThan(0);
    expect(component.skinTypes).toContain('Dry');
  });

  it('should have correct hair color options', () => {
    expect(component.hairColors.length).toBeGreaterThan(0);
    expect(component.hairColors).toContain('Brown');
  });
});
