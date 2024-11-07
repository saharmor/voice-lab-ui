import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Download, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooptip';

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

const KeyValueEditor = ({ items = [], onChange, label }) => {
  const addItem = () => {
    onChange([...items, { key: '', value: '' }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Key"
            value={item.key}
            onChange={(e) => updateItem(index, 'key', e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={item.value}
            onChange={(e) => updateItem(index, 'value', e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
};

const MetricEditor = ({ name, metric, onChange }) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <div className="space-y-4">
        <div>
          <Label>Metric Name</Label>
          <Input 
            value={name} 
            onChange={(e) => onChange(e.target.value, 'name')}
            className="mt-1"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Label>Evaluation Prompt</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Explain the LLM how to evaluate this metric</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            value={metric.eval_prompt} 
            onChange={(e) => onChange(e.target.value, 'eval_prompt')}
            className="mt-1"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Label>Output Type</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Success Flag: boolean metric (true/false)<br/>Range Score: numeric score (1-10)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select 
            value={metric.eval_output}
            onValueChange={(value) => onChange(value, 'eval_output')}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success_flag">Success Flag</SelectItem>
              <SelectItem value="range_score">Range Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {metric.eval_output === 'range_score' && (
          <div>
            <Label>Range Score Threshold</Label>
            <Input 
              type="number"
              value={metric.range_score_success_threshold || 6}
              onChange={(e) => onChange(Number(e.target.value), 'range_score_success_threshold')}
              className="mt-1"
            />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const ScenarioEditor = ({ name, scenario, onChange }) => (
  <Card className="mb-4">
    <CardContent className="pt-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Label>Scenario Name</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Name to identify test in the generated report</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            value={name} 
            className="mt-1"
            onChange={(e) => onChange(e.target.value, 'name')}
          />
        </div>
        
        <div>
          <Label>Tested LLMs</Label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {scenario.tested_components.underlying_llms.map((llm, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select 
                  value={llm}
                  onValueChange={(value) => {
                    const newLLMs = [...scenario.tested_components.underlying_llms];
                    newLLMs[index] = value;
                    onChange(newLLMs, 'llms');
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LLM_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const newLLMs = scenario.tested_components.underlying_llms.filter((_, i) => i !== index);
                    onChange(newLLMs, 'llms');
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => {
                const newLLMs = [...scenario.tested_components.underlying_llms, LLM_OPTIONS[0]];
                onChange(newLLMs, 'llms');
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Agent Configuration Section */}
        <div>
          <Label className="text-lg font-semibold">Agent Configuration</Label>
          <div className="space-y-4 mt-2 pl-4 border-l-2 border-gray-200">
            <div>
              <Label>Initial Message</Label>
              <Input 
                value={scenario.agent.initial_message}
                onChange={(e) => onChange(e.target.value, 'agent_message')}
                className="mt-1"
              />
            </div>
            <KeyValueEditor
              items={Object.entries(scenario.agent.additional_context || {}).map(([key, value]) => ({ key, value }))}
              onChange={(items) => {
                const newContext = {};
                items.forEach(item => {
                  if (item.key && item.value) {
                    newContext[item.key] = item.value;
                  }
                });
                onChange(newContext, 'agent_context');
              }}
              label="Additional Context"
            />
          </div>
        </div>

        {/* Persona Configuration Section */}
        <div>
          <Label className="text-lg font-semibold">Persona Configuration</Label>
          <div className="space-y-4 mt-2 pl-4 border-l-2 border-gray-200">
            <div>
              <Label>Name</Label>
              <Input 
                value={scenario.persona.name}
                onChange={(e) => onChange(e.target.value, 'persona_name')}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Initial Message</Label>
              <Input 
                value={scenario.persona.initial_message}
                onChange={(e) => onChange(e.target.value, 'persona_initial_message')}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input 
                value={scenario.persona.role}
                onChange={(e) => onChange(e.target.value, 'persona_role')}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Mood</Label>
              <Select 
                value={scenario.persona.mood.toLowerCase()}
                onValueChange={(value) => onChange(value.toUpperCase(), 'persona_mood')}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map(mood => (
                    <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <KeyValueEditor
              items={Object.entries(scenario.persona.additional_context || {}).map(([key, value]) => ({ key, value }))}
              onChange={(items) => {
                const newContext = {};
                items.forEach(item => {
                  if (item.key && item.value) {
                    newContext[item.key] = item.value;
                  }
                });
                onChange(newContext, 'persona_context');
              }}
              label="Additional Context"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ConfigEditor = () => {
  const [evalMetrics, setEvalMetrics] = useState({
    task_completion: {
      eval_prompt: "Evaluate whether the task was completed even if the goal was not achieved...",
      eval_output: "success_flag"
    },
    goal_achieved: {
      eval_prompt: "Evaluate whether the goal was achieved based on the conversation history...",
      eval_output: "success_flag"
    }
  });

  const [scenarios, setScenarios] = useState({
    angry_hotel_receptionist: {
      tested_components: {
        underlying_llms: ["gpt-4o-mini"],
        agent_system_prompts: ["You are a voice agent trying to book a hotel room..."]
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
                        underlying_llms: field === 'llms' ? value : prev[name].tested_components.underlying_llms
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
              className="w-full"
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
  </div>
);
};

export default ConfigEditor;