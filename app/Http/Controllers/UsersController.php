<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    public function index()
    {
        $users = Users::all();
        $userList = [];
        foreach($users as $user){
            $list = [];
            $list['id']=$user->id;
            $list['name']=$user->name;
            $list['email']=$user->email;
            $list['phone']=$user->phone;
            $list['role_name']=self::show($user->role_id)->original;
            $list['description']=$user->description;
            $list['profile_image']=$user->profile_image;
            $userList[]=$list;
        }
        return response()->json($userList);
    }
    public function saveUserData(Request $request)
    {
        $data = $request->all();

        // Validate the request data
        $validatedData = Validator::make($data,[
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'phone' => ['required', 'regex:/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/', 'min:10', 'max:13'],
            'description' => 'string',
            'profile_image'=> 'required|file|mimes:jpg,png|max:2048',
            'role_id' => 'required|integer',
        ], [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',
        
            'email.required' => 'The email field is required.',
            'email.email' => 'Please provide a valid email address.',
            'email.max' => 'The email may not be greater than 255 characters.',
        
            'phone.required' => 'The phone number is required.',
            'phone.regex' => 'Please provide a valid Indian phone number.',
            'phone.min' => 'The phone number must be at least 10 digits.',
            'phone.max' => 'The phone number may not be greater than 13 digits.',
        
            'description.string' => 'The description must be a string.',
        
            'profile_image.required' => 'The profile image is required.',
            'profile_image.file' => 'The profile image must be a file.',
            'profile_image.mimes' => 'The profile image must be in jpg or png format.',
            'profile_image.max' => 'The profile image may not be greater than 2MB.',
            'role_id.required' => 'The Role is required',
            'role_id.integer' => 'The Role need to be a number',
        ]);
        if ($validatedData->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validatedData->errors()
            ], 422);
        }
        $filePath = null;
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            // Store file in 'public/profile_images' directory
            $filePath = $file->store('profile_images', 'public');
            $data['profile_image'] = '/storage/' . $filePath;
            //$request->merge($data);
        }
        //dd($request->all());
        //$request->profile_image = $filePath;
        // Save the form submission to the database
        //$formSubmission = FormSubmission::create($validatedData);
        $formSubmission=  Users::create($data);/* $request->all() User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'profile_image' => $filePath,
                'description' => $request->description,
                'role_id' => $request->role_id,
            ]); */ 

        // Return a success response
        return response()->json([
            'success' => true,
            'data' => $formSubmission,
            'file' => $data,
            'message' => 'Form submitted successfully!',
        ], 201);
    }

    public function show($id)
    {
        $user = Users::with('role')->find($id);   
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user->role_id ? $user->role->name : 'No Role');

        /* return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role_name' => $user->role_id ? $user->role->name : 'No Role'
        ]); */
    }
    
}
