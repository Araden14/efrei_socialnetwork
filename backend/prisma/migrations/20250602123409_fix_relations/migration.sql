/*
  Warnings:

  - You are about to drop the `_ChatToMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `userid` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_id_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatId" INTEGER NOT NULL,
ALTER COLUMN "userid" SET NOT NULL;

-- DropTable
DROP TABLE "_ChatToMessage";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
