import React from "react";
import "../styles/TransactionsList.css"; // Lien vers le fichier CSS pour ce composant

const TransactionsList = ({ transactions, title }) => {
//   return (
//     <div className="transactions-list">
//       <h2>{title}</h2>
//       {transactions.length === 0 ? (
//         <p className="empty-message">Aucune transaction pour le moment.</p>
//       ) : (
//         <ul>
//           {transactions.map((transaction) => (
//             <li key={transaction.id} className="transaction-card">
//               <div>
//                 <h3>{transaction.item_name}</h3>
//                 <p>
//                   Type : <strong>{transaction.type === "loan" ? "Emprunt" : "Don"}</strong>
//                 </p>
//                 <p>
//                   Date : <strong>{new Date(transaction.date).toLocaleDateString()}</strong>
//                 </p>
//               </div>
//               <p>Utilisateur : {transaction.user_name}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
};

export default TransactionsList;