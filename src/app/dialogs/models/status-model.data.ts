export interface IStatusData {
  title: string;
  updateText: string | 'Active' | 'In Active';
  type: string;
  buttonText: string;
  actionData?: any
}
