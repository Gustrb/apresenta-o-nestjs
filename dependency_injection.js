class DependencyContainer {
  constructor() {
    this._dependencies = {};
  }

  register(type) {
    const instance = this.resolve(type);
    this._dependencies[type.name] = instance;
  }
  
  // Esse é o método responsável por pegar o nome da depedencia e encontrar
  // ela na lista de dependencias disponiveis
  resolve(type) {
    const dependencies = type._dependencies;

    // Caso o tipo não tenha dependencias, simplesmente retorne uma nova instancia 
    // do mesmo
    if (!dependencies || dependencies.length == 0) {
      return new type();      
    }
    
    // Vai pegar cada dependencia de dentro do container de acordo com o seu nome e retornar
    // um array com todas as instancias
    const resolvedDependencies = dependencies.map((name) => this.resolveDependencyByName(name)); 
    // Constroi o tipo passando todas as dependencias que ele precisa
    return new type(...resolvedDependencies);
  }

  resolveDependencyByName(dependencyName) {
    const dep = this._dependencies[dependencyName];

    if (!dep) {
      throw `${dependencyName} was not found in the container`;
    }

    return dep;
  }
}

class PersonStringValidator {
  isValidEmail(email) {
    return this.isOfTypeString(email) && this.hasAnAtCharacter(email);
  }

  hasAnAtCharacter(email) {
    return email.indexOf('@') !== -1;
  }

  isOfTypeString(email) {
    return typeof email === 'string';
  }
}

class Person {
  static _dependencies = ['PersonStringValidator'];

  constructor(personStringValidator) {
    this._personStringValidator = personStringValidator;
  }

  set email(email) {
    if (!this._personStringValidator.isValidEmail(email)) {
      throw new Error(`${email} is not a valid email`);
    }

    this._email = email;
  }
}

function main() {
  const dependencyContainer = new DependencyContainer();
  dependencyContainer.register(PersonStringValidator);

  const person = dependencyContainer.resolve(Person);
  person.email = 'gustavo@gmail.com';
  console.log(person);
}

main();

