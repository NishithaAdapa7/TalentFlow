import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssessment, saveAssessment } from "../../API/AssessmentsApi";
import AssessmentPreview from "./AssessmentPreview";
import "../../CSS/Assessments.css";

const QUESTION_TYPES = ["single", "multi", "short", "long", "numeric", "file"];

export default function AssessmentBuilder() {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState({ jobId, sections: [], questions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAssessment(jobId);
      if (!data.sections) data.sections = [];
      setAssessment(data);
      setLoading(false);
    }
    load();
  }, [jobId]);

  // --- Builder functions ---
  const addSection = () => {
    setAssessment({
      ...assessment,
      sections: [
        ...assessment.sections,
        { id: Date.now(), title: "", questions: [] },
      ],
    });
  };

  const addQuestion = (sectionId = null) => {
    const newQ = {
      id: Date.now(),
      text: "",
      type: "single",
      options: ["Option 1"],
      required: false,
      condition: { questionId: null, value: null },
      min: null,
      max: null,
    };

    if (sectionId) {
      setAssessment({
        ...assessment,
        sections: assessment.sections.map(s =>
          s.id === sectionId ? { ...s, questions: [...s.questions, newQ] } : s
        ),
      });
    } else {
      setAssessment({
        ...assessment,
        questions: [...assessment.questions, newQ],
      });
    }
  };

  const updateQuestion = (id, field, value, sectionId = null) => {
    if (sectionId) {
      setAssessment({
        ...assessment,
        sections: assessment.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                questions: s.questions.map(q => (q.id === id ? { ...q, [field]: value } : q)),
              }
            : s
        ),
      });
    } else {
      setAssessment({
        ...assessment,
        questions: assessment.questions.map(q => (q.id === id ? { ...q, [field]: value } : q)),
      });
    }
  };

  const addOption = (qId, sectionId = null) => {
    if (sectionId) {
      setAssessment({
        ...assessment,
        sections: assessment.sections.map(s =>
          s.id === sectionId
            ? {
                ...s,
                questions: s.questions.map(q =>
                  q.id === qId ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q
                ),
              }
            : s
        ),
      });
    } else {
      setAssessment({
        ...assessment,
        questions: assessment.questions.map(q =>
          q.id === qId ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q
        ),
      });
    }
  };

  const save = async () => {
    try {
      await saveAssessment(jobId, assessment);
      alert("Assessment saved!");
    } catch {
      alert("Save failed.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="assessment-container">
      <div className="builder">
        <h2>Assessment Builder</h2>
        <button className="add-question-btn" onClick={addSection}>Add Section</button>
        {assessment.sections.map(section => (
          <div key={section.id} className="section-card">
            <input
              type="text"
              placeholder="Section title"
              value={section.title}
              onChange={e => {
                const updated = { ...section, title: e.target.value };
                setAssessment({
                  ...assessment,
                  sections: assessment.sections.map(s => (s.id === section.id ? updated : s)),
                });
              }}
            />
            <button onClick={() => addQuestion(section.id)}>Add Question</button>
            {section.questions.map(q => (
              <div key={q.id} className="question-card">
                <input
                  type="text"
                  placeholder="Question text"
                  value={q.text}
                  onChange={e => updateQuestion(q.id, "text", e.target.value, section.id)}
                />
                <select value={q.type} onChange={e => updateQuestion(q.id, "type", e.target.value, section.id)}>
                  {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {(q.type === "single" || q.type === "multi") &&
                  <>
                    {q.options.map((opt, i) => (
                      <input
                        key={i}
                        type="text"
                        value={opt}
                        onChange={e => updateQuestion(q.id, "options", q.options.map((o, idx) => idx === i ? e.target.value : o), section.id)}
                      />
                    ))}
                    <button onClick={() => addOption(q.id, section.id)}>Add Option</button>
                  </>
                }
                <label>
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={e => updateQuestion(q.id, "required", e.target.checked, section.id)}
                  /> Required
                </label>
                {q.type === "numeric" && (
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={q.min || ""}
                      onChange={e => updateQuestion(q.id, "min", e.target.value, section.id)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={q.max || ""}
                      onChange={e => updateQuestion(q.id, "max", e.target.value, section.id)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <button onClick={save} className="save-btn">Save Assessment</button>
      </div>

      <div className="preview">
        <AssessmentPreview assessment={assessment} />
      </div>
    </div>
  );
}
