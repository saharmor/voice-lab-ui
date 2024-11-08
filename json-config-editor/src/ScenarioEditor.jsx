import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

import KeyValueEditor from './KeyValueEditor';
import { LLM_OPTIONS, MOOD_OPTIONS } from './consts';

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
  
          <div>
            <Label>Tested Prompts</Label>
            <div className="space-y-2 mt-1">
              {scenario.tested_components.agent_system_prompts.map((prompt, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={prompt}
                    onChange={(e) => {
                      const newPrompts = [...scenario.tested_components.agent_system_prompts];
                      newPrompts[index] = e.target.value;
                      onChange(newPrompts, 'prompts');
                    }}
                    className="flex-1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newPrompts = scenario.tested_components.agent_system_prompts.filter((_, i) => i !== index);
                      onChange(newPrompts, 'prompts');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newPrompts = [...scenario.tested_components.agent_system_prompts];
                  newPrompts.push("");
                  onChange(newPrompts, 'prompts');
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Prompt
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
                    newContext[item.key] = item.value;
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
                      newContext[item.key] = item.value;
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

export default ScenarioEditor;