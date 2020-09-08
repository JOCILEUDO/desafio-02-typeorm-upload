import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from "../repositories/TransactionsRepository";
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
} 


class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
  
    if(type != 'income' && type != 'outcome'){
      throw new AppError("type is invaliable");
    }
    
    if(typeof(category) == "undefined" || category == null) {
      throw new AppError("Category is required");
    }

    const { total } = await transactionsRepository.getBalance();

    if(type == 'outcome' && total < value){
      throw new AppError("You do not have enough balance");
    }

    //Verifica se existe já uma categoria
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    // se não existe
    if(!transactionCategory){
        
      transactionCategory = categoryRepository.create({ title: category });
        
        await categoryRepository.save(transactionCategory);
    }
    const transaction = transactionsRepository.create({
      title, 
      value, 
      type,
      category_id: transactionCategory.id
    });
    
    await transactionsRepository.save(transaction);
    
    return transaction;
  }
}

export default CreateTransactionService;
