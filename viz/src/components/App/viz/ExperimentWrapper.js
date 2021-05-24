import React from 'react';

export function ExperimentWrapper({title, variables, properties, children, details}) {
  return (
      <div className="Experiment">
        <h2>{title}:</h2>
        <h3>{details}:</h3>
        <div className="experiment-header">
          <div>
            <h3>Properties:</h3>
            {properties.map(p => (
                <h4>{p.label}: {p.value}</h4>
            ))}
          </div>
          <div>
            <h3>Variables:</h3>
            {variables.map(variable => (
                <h4>{variable.label}: {`{${variable.values.toString()}}`}</h4>
            ))}
          </div>
        </div>
        <div className="experiment-content">
          {children}
        </div>
      </div>
  )
}