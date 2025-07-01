// declare module './assets' {
//   export const assets: {
//     [key: string]: string;
//   };
//   export const JobCategories: string[];
//   export const JobLocations:string[];
//   export const jobsData: {
//     _id: string;
//     title: string;
//     location: string;
//     level: string;
//     category: string;
//     salary: number;
//     date: number;
//     description: string;
//     companyId: {
//       _id: string;
//       name: string;
//       email: string;
//       image: string;
//     };
//   }[];
//   export const jobsApplied: {
//     company: string;
//     title: string;
//     location: string;
//     date: string;
//     status: 'Pending' | 'Accepted' | 'Rejected';
//     logo: string;
//   }[];
// }
declare module '*.svg' {
  const value: string;
  export default value;
}
declare module '*.png' {
  const value: string;
  export default value;
}