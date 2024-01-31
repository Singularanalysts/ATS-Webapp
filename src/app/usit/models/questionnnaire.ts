export interface QuestionGroup {
  userid: number
  department: string
  category: string
  qid: number
  options: Option[]
}

export interface Option {
  id: number
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  question: string
  userans: string
}
