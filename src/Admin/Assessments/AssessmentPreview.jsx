import React, { useState } from "react";
import { submitResponses } from "../../API/AssessmentsApi";

export default function AssessmentPreview({ assessment }) {
  const [responses, setResponses] = useState({});

  const handleChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  const handleSubmit = async () => {
  // Validate
  let valid = true;
  const errors = [];

  assessment.sections.forEach(section => {
    section.questions.forEach(q => {
      const ans = responses[q.id];
      if (q.required && (ans === undefined || ans === "" || (Array.isArray(ans) && ans.length === 0))) {
        valid = false;
        errors.push(`"${q.text}" is required`);
      }
      if (q.type === "numeric") {
        if (q.min != null && ans < q.min) { valid = false; errors.push(`"${q.text}" must be ≥ ${q.min}`); }
        if (q.max != null && ans > q.max) { valid = false; errors.push(`"${q.text}" must be ≤ ${q.max}`); }
      }
    });
  });

  if (!valid) return alert(errors.join("\n"));

  await submitResponses(assessment.jobId, responses);
  alert("Responses submitted!");
};


  return (
    <div>
      <h2>Live Preview</h2>
      {assessment.sections.map(section =>
        section.questions.map(q => {
          if (q.condition.questionId && responses[q.condition.questionId] !== q.condition.value) return null;
          switch (q.type) {
            case "single":
              return (
                <div key={q.id}>
                  <p>{q.text}</p>
                  {q.options.map(opt => (
                    <label key={opt}>
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt}
                        checked={responses[q.id] === opt}
                        onChange={e => handleChange(q.id, e.target.value)}
                      /> {opt}
                    </label>
                  ))}
                </div>
              );
            case "multi":
              return (
                <div key={q.id}>
                  <p>{q.text}</p>
                  {q.options.map(opt => (
                    <label key={opt}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={responses[q.id]?.includes(opt) || false}
                        onChange={e => {
                          const arr = responses[q.id] || [];
                          if (e.target.checked) arr.push(opt);
                          else arr.splice(arr.indexOf(opt), 1);
                          handleChange(q.id, [...arr]);
                        }}
                      /> {opt}
                    </label>
                  ))}
                </div>
              );
            case "short":
            case "long":
              return (
                <div key={q.id}>
                  <p>{q.text}</p>
                  <input type="text" value={responses[q.id] || ""} onChange={e => handleChange(q.id, e.target.value)} />
                </div>
              );
            case "numeric":
              return (
                <div key={q.id}>
                  <p>{q.text}</p>
                  <input type="number" value={responses[q.id] || ""} onChange={e => handleChange(q.id, e.target.value)} />
                </div>
              );
            case "file":
              return (
                <div key={q.id}>
                  <p>{q.text}</p>
                  <input type="file" disabled />
                </div>
              );
            default:
              return null;
          }
        })
      )}
      <button className="submit-btn" onClick={handleSubmit}>Submit Responses</button>
    </div>
  );
}
