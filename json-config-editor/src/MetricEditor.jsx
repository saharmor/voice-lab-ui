import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

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

export default MetricEditor;