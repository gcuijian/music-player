package com.createdpro.controller;

import com.createdpro.service.MusicService;
import com.createdpro.vo.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MusicController {

    @Autowired
    private MusicService musicService;

    @PostMapping("/getMusicList.pro")
    public JsonResult getMusicList(){
        return musicService.getList();
    }

    @PostMapping("/getMusic.pro")
    public byte[] getMusic(String name){
        return musicService.getMusic(name);
    }

}
