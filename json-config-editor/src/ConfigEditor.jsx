import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

import { Github } from 'lucide-react';

import MetricEditor from './MetricEditor';
import ScenarioEditor from './ScenarioEditor';

const LLM_OPTIONS = [
  "gpt-3.5-turbo",
  "gpt-4o",
  "gpt-4o-mini",
  "o1-mini",
  "o1-preview"
];

const MOOD_OPTIONS = [
  "neutral",
  "happy",
  "angry",
  "frustrated",
  "helpful",
  "confused",
  "professional",
  "impatient"
];


const ConfigEditor = () => {
  const [evalMetrics, setEvalMetrics] = useState({
    task_completion: {
      eval_prompt: "Evaluate whether the task was completed even if the goal was not achieved, for example, the agent did everything possible to book a room but no rooms were available is still a success (True). On the other hand, if the agent try its best to complete the task, it is a failure (False).",
      eval_output: "success_flag"
    },
    goal_achieved: {
      eval_prompt: "Evaluate whether the goal was achieved based on the conversation history and the success criteria, e.g. booking a room, booking a flight, etc.",
      eval_output: "success_flag"
    }
  });

  const [scenarios, setScenarios] = useState({
    angry_hotel_receptionist: {
      tested_components: {
        underlying_llms: ["gpt-4o-mini"],
        agent_system_prompts: ["You are a voice agent trying to book a hotel room for yourself on December 12th-24th. Make sure to confirm the price and booking reference when booking."]
      },
      agent: {
        initial_message: "Hi, I'd like to book a room",
        success_criteria: {
          required_confirmations: ["booking_reference", "price"]
        },
        additional_context: {}
      },
      persona: {
        name: "John Smith",
        initial_message: "Hello, how may I help you today?",
        role: "hotel_receptionist",
        traits: ["impatient", "curt"],
        mood: "ANGRY",
        response_style: "CURT",
        additional_context: {}
      }
    }
  });

  const handleExport = () => {
    const evalMetricsBlob = new Blob(
      [JSON.stringify(evalMetrics, null, 2)],
      { type: 'application/json' }
    );
    
    const scenariosBlob = new Blob(
      [JSON.stringify(scenarios, null, 2)],
      { type: 'application/json' }
    );

    const evalMetricsUrl = URL.createObjectURL(evalMetricsBlob);
    const evalMetricsLink = document.createElement('a');
    evalMetricsLink.href = evalMetricsUrl;
    evalMetricsLink.download = 'eval_metrics.json';
    document.body.appendChild(evalMetricsLink);
    evalMetricsLink.click();
    document.body.removeChild(evalMetricsLink);

    const scenariosUrl = URL.createObjectURL(scenariosBlob);
    const scenariosLink = document.createElement('a');
    scenariosLink.href = scenariosUrl;
    scenariosLink.download = 'test_scenarios.json';
    document.body.appendChild(scenariosLink);
    scenariosLink.click();
    document.body.removeChild(scenariosLink);

    URL.revokeObjectURL(evalMetricsUrl);
    URL.revokeObjectURL(scenariosUrl);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Voice Lab Configuration Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics">
            <TabsList className="mb-4">
              <TabsTrigger value="metrics">Evaluation Metrics</TabsTrigger>
              <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
            </TabsList>

            <div className="text-gray-500 mb-6">
              <TabsContent value="metrics">
                Configure evaluation metrics that will be used to assess the performance of AI agents in various scenarios.
                Each metric can be evaluated using either a success flag or a range score.
              </TabsContent>
              <TabsContent value="scenarios">
                Define test scenarios including agent behavior, persona characteristics, and success criteria.
                Each scenario can be tested against multiple LLM models.
              </TabsContent>
            </div>

            <TabsContent value="metrics">
              {Object.entries(evalMetrics).map(([name, metric]) => (
                <MetricEditor
                  key={name}
                  name={name}
                  metric={metric}
                  onChange={(value, field) => {
                    setEvalMetrics(prev => ({
                      ...prev,
                      [name]: {
                        ...prev[name],
                        [field]: value
                    }
                  }));
                }}
              />
            ))}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const newName = `metric_${Object.keys(evalMetrics).length + 1}`;
                setEvalMetrics(prev => ({
                  ...prev,
                  [newName]: {
                    eval_prompt: "",
                    eval_output: "success_flag"
                  }
                }));
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Metric
            </Button>
          </TabsContent>

          <TabsContent value="scenarios">
            {Object.entries(scenarios).map(([name, scenario]) => (
              <ScenarioEditor
                key={name}
                name={name}
                scenario={scenario}
                onChange={(value, field) => {
                  setScenarios(prev => ({
                    ...prev,
                    [name]: {
                      ...prev[name],
                      tested_components: {
                        ...prev[name].tested_components,
                        underlying_llms: field === 'llms' ? value : prev[name].tested_components.underlying_llms,
                        agent_system_prompts: field === 'prompts' ? value : prev[name].tested_components.agent_system_prompts
                      },
                      agent: {
                        ...prev[name].agent,
                        initial_message: field === 'agent_message' ? value : prev[name].agent.initial_message,
                        additional_context: field === 'agent_context' ? value : prev[name].agent.additional_context
                      },
                      persona: {
                        ...prev[name].persona,
                        name: field === 'persona_name' ? value : prev[name].persona.name,
                        initial_message: field === 'persona_initial_message' ? value : prev[name].persona.initial_message,
                        role: field === 'persona_role' ? value : prev[name].persona.role,
                        mood: field === 'persona_mood' ? value : prev[name].persona.mood,
                        additional_context: field === 'persona_context' ? value : prev[name].persona.additional_context
                      }
                    }
                  }));
                }}
              />
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newName = `scenario_${Object.keys(scenarios).length + 1}`;
                setScenarios(prev => ({
                  ...prev,
                  [newName]: {
                    tested_components: {
                      underlying_llms: [LLM_OPTIONS[0]],
                      agent_system_prompts: [""]
                    },
                    agent: {
                      initial_message: "",
                      success_criteria: {
                        required_confirmations: []
                      },
                      additional_context: {}
                    },
                    persona: {
                      name: "",
                      initial_message: "",
                      role: "",
                      traits: [],
                      mood: "PROFESSIONAL",
                      response_style: "FORMAL",
                      additional_context: {}
                    }
                  }
                }));
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Scenario
            </Button>
          </TabsContent>
        </Tabs>

        <Button 
          className="mt-6 w-full"
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Configuration Files
        </Button>
      </CardContent>
    </Card>

    <footer className="flex justify-center items-center p-4">
        <a href="https://github.com/saharmor/voice-lab-ui" target="_blank" rel="noopener noreferrer">
          <Github className="h-6 w-6 text-gray-600"/>
        </a>
      </footer>
  </div>
);
};

export default ConfigEditor;