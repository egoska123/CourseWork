export interface Subsection {
    title: string;
    content: string[];
  }
  
  export interface Section {
    title: string;
    content: Subsection[];
  }
  
  export interface CourseStructure {
    filename: string;
    intro: { content: string[] };
    content: Section[];
    summery: { content: string[] };
    literature: { content: string[] };
  }
  