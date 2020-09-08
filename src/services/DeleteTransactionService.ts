import { getCustomRepository } from "typeorm";

import Transactionsrepository from "../repositories/TransactionsRepository";

import AppError from "../errors/AppError";


class DeleteTransactionService {
  public async execute(id: string): Promise<void> {

    const transactionsRepository = getCustomRepository(Transactionsrepository); 

    const transaction = await transactionsRepository.findOne(id); 

    if(!transaction){
      throw new AppError("Transactions does not exist");
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
