import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the schema for form validation
const questionSchema = z.object({
  type: z.enum(["Multiple Choice", "Short Answer", "Essay"]),
  question: z.string().min(1, "Question is required"),
  imageUrl: z.string().optional(),
  answers: z.array(z.string()).min(2, "At least two answers are required"),
  correctAnswer: z.number().min(0),
  area: z.string().min(1, "Area is required"),
  focusArea: z.string().min(1, "Focus Area is required"),
  contentGroup: z.string().min(1, "Content Group is required"),
  contentPoint: z.string().min(1, "Content Point is required"),
  outcomes: z.array(z.string()),
});

const formSchema = z.object({
  testName: z.string().min(1, "Test name is required"),
  stage: z.string().min(1, "Stage is required"),
  questions: z.array(questionSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function Component() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = (React.useState < string) | (null > null);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm <
  FormValues >
  {
    resolver: zodResolver(formSchema),
    defaultValues: {
      testName: "",
      stage: "Early Stage 1",
      questions: [
        {
          type: "Multiple Choice",
          question: "",
          imageUrl: "",
          answers: ["", "", "", ""],
          correctAnswer: 0,
          area: "",
          focusArea: "",
          contentGroup: "",
          contentPoint: "",
          outcomes: [],
        },
      ],
    },
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(data);
      // Handle form submission here
    } catch (err) {
      setError("An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Test</CardTitle>
          <CardDescription>
            Create a new test with questions and answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="testName">Test Name</Label>
              <Input id="testName" {...register("testName")} />
              {errors.testName && (
                <p className="text-sm text-red-500">
                  {errors.testName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stage">Stage</Label>
              <Select {...register("stage")}>
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Early Stage 1">Early Stage 1</SelectItem>
                  <SelectItem value="Stage 1">Stage 1</SelectItem>
                  <SelectItem value="Stage 2">Stage 2</SelectItem>
                  <SelectItem value="Stage 3">Stage 3</SelectItem>
                </SelectContent>
              </Select>
              {errors.stage && (
                <p className="text-sm text-red-500">{errors.stage.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="question" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="question">Question</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>
              <TabsContent value="question">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.type`}>
                      Question Type
                    </Label>
                    <Select {...register(`questions.${index}.type`)}>
                      <SelectTrigger id={`questions.${index}.type`}>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Multiple Choice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="Short Answer">
                          Short Answer
                        </SelectItem>
                        <SelectItem value="Essay">Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.question`}>
                      Question
                    </Label>
                    <Textarea
                      id={`questions.${index}.question`}
                      {...register(`questions.${index}.question`)}
                    />
                    {errors.questions?.[index]?.question && (
                      <p className="text-sm text-red-500">
                        {errors.questions[index]?.question?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.imageUrl`}>
                      Image URL
                    </Label>
                    <Input
                      id={`questions.${index}.imageUrl`}
                      {...register(`questions.${index}.imageUrl`)}
                    />
                  </div>
                  {field.answers.map((_, answerIndex) => (
                    <div
                      key={answerIndex}
                      className="flex flex-col space-y-1.5"
                    >
                      <Label
                        htmlFor={`questions.${index}.answers.${answerIndex}`}
                      >
                        Answer {answerIndex + 1}
                      </Label>
                      <Input
                        id={`questions.${index}.answers.${answerIndex}`}
                        {...register(
                          `questions.${index}.answers.${answerIndex}`
                        )}
                      />
                    </div>
                  ))}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.correctAnswer`}>
                      Correct Answer
                    </Label>
                    <Input
                      id={`questions.${index}.correctAnswer`}
                      type="number"
                      {...register(`questions.${index}.correctAnswer`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="metadata">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.area`}>Area</Label>
                    <Input
                      id={`questions.${index}.area`}
                      {...register(`questions.${index}.area`)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.focusArea`}>
                      Focus Area
                    </Label>
                    <Input
                      id={`questions.${index}.focusArea`}
                      {...register(`questions.${index}.focusArea`)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.contentGroup`}>
                      Content Group
                    </Label>
                    <Input
                      id={`questions.${index}.contentGroup`}
                      {...register(`questions.${index}.contentGroup`)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`questions.${index}.contentPoint`}>
                      Content Point
                    </Label>
                    <Input
                      id={`questions.${index}.contentPoint`}
                      {...register(`questions.${index}.contentPoint`)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Question
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            type: "Multiple Choice",
            question: "",
            imageUrl: "",
            answers: ["", "", "", ""],
            correctAnswer: 0,
            area: "",
            focusArea: "",
            contentGroup: "",
            contentPoint: "",
            outcomes: [],
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Question
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Offline</AlertTitle>
          <AlertDescription>
            You are currently offline. Please check your internet connection.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
