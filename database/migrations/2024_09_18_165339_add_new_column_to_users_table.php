<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //$table->drop(['role_id']);
            
            // Modify the role_id column to be a foreign key
            //$table->unsignedBigInteger('role_id')->change(); // Ensure the column type is compatible

            // Add the foreign key constraint
            //$table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       /*  Schema::table('users', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['role_id']);
            
            // Optionally, revert the column type change if needed
            $table->integer('role_id')->change(); // Adjust type to the previous type

            // Add the old foreign key constraint if needed
            // $table->foreign('role_id')->references('id')->on('roles');
        }); */
    }
};
