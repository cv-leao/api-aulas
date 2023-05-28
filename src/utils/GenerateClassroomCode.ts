export default function generateClassroomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
  
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  