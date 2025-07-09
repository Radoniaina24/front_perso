export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  status: "active" | "on_leave" | "inactive";
  photo: string;
}

export interface Department {
  name: string;
  employeeCount: number;
  percentage: number;
  color: string;
}

export interface StatCard {
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  color: string;
  hoverColor: string;
}
